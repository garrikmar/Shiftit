import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { toast } from "sonner";

type ShiftType = "morning" | "evening" | "night";

function getNextMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  const toISO = (d: Date) => d.toISOString().split("T")[0];
  return { start, end, startISO: toISO(start), endISO: toISO(end) };
}

export function AddShiftView() {
  const { start, end, startISO, endISO } = useMemo(getNextMonthRange, []);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(start);
  const [selectedTypes, setSelectedTypes] = useState<ShiftType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Map ISO date -> array of shift types
  const [savedShifts, setSavedShifts] = useState<Record<string, ShiftType[]>>({});
  // Drag select state (for selecting multiple days by drag)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDay, setDragStartDay] = useState<number | null>(null);
  const [dragCurrentDay, setDragCurrentDay] = useState<number | null>(null);
  const [committedRange, setCommittedRange] = useState<{ start: number; end: number } | null>(null);
  // Persist to localStorage using a key per next-month (YYYY-MM)
  const storageKey = useMemo(() => {
    const y = start.getFullYear();
    const m = String(start.getMonth() + 1).padStart(2, "0");
    return `addShift:savedShifts:${y}-${m}`;
  }, [start]);

  // Load saved shifts on mount / when month key changes
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, ShiftType[]>;
        // Basic validation: ensure values are arrays of allowed strings
        const allowed: ShiftType[] = ["morning", "evening", "night"];
        const cleaned: Record<string, ShiftType[]> = {};
        Object.entries(parsed).forEach(([iso, arr]) => {
          if (Array.isArray(arr)) {
            const uniq = Array.from(new Set(arr.filter((v): v is ShiftType => allowed.includes(v as ShiftType))));
            if (uniq.length) cleaned[iso] = uniq;
          }
        });
        setSavedShifts(cleaned);
      } else {
        setSavedShifts({});
      }
    } catch {
      // corrupted data, reset
      setSavedShifts({});
    }
  }, [storageKey]);

  // Persist on change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(savedShifts));
      }
    } catch {
      // ignore quota or serialization errors
    }
  }, [storageKey, savedShifts]);
  const weekDays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const daysInMonth = end.getDate();
  const labelMap: Record<ShiftType, string> = { morning: "בוקר", evening: "ערב", night: "לילה" };

  // Totals breakdown for chosen shifts across the month
  const totals = useMemo(() => {
    let morning = 0;
    let evening = 0;
    let night = 0;
    Object.values(savedShifts).forEach((arr) => {
      if (!Array.isArray(arr)) return;
      if (arr.includes("morning")) morning += 1;
      if (arr.includes("evening")) evening += 1;
      if (arr.includes("night")) night += 1;
    });
    return { morning, evening, night };
  }, [savedShifts]);

  // Active (temporary) range while dragging
  const activeRange = useMemo(() => {
    if (!isDragging || dragStartDay == null || dragCurrentDay == null) return null;
    const startD = Math.max(1, Math.min(dragStartDay, dragCurrentDay));
    const endD = Math.min(daysInMonth, Math.max(dragStartDay, dragCurrentDay));
    return { start: startD, end: endD };
  }, [isDragging, dragStartDay, dragCurrentDay, daysInMonth]);

  // All currently selected days (either committed range or single selectedDate)
  const selectedDaysSet = useMemo(() => {
    const set = new Set<number>();
    const range = activeRange ?? committedRange;
    if (range) {
      for (let d = range.start; d <= range.end; d++) set.add(d);
    } else if (selectedDate) {
      set.add(selectedDate.getDate());
    }
    return set;
  }, [activeRange, committedRange, selectedDate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTypes.length === 0) {
      toast.error("נא לבחור סוג משמרת");
      return;
    }
    // Determine target days to apply to: committed/active range or single selected date
    const daysToApply: number[] = selectedDaysSet.size
      ? Array.from(selectedDaysSet).sort((a, b) => a - b)
      : selectedDate
      ? [selectedDate.getDate()]
      : [];
    if (daysToApply.length === 0) {
      toast.error("נא לבחור יום או טווח ימים");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      // compute shifts to add (multi-select already)
      const toAdd: ShiftType[] = Array.from(new Set(selectedTypes));

      setSavedShifts((prev) => {
        const next: Record<string, ShiftType[]> = { ...prev };
        for (const d of daysToApply) {
          const iso = new Date(start.getFullYear(), start.getMonth(), d).toISOString().split("T")[0];
          const existing = next[iso] ?? [];
          const merged = Array.from(new Set<ShiftType>([...existing, ...toAdd]));
          next[iso] = merged;
        }
        return next;
      });
      const addedLabel = toAdd.length === 3 ? "כל המשמרות" : toAdd.map((t) => labelMap[t]).join(", ");
      if (daysToApply.length === 1) {
        const iso = new Date(start.getFullYear(), start.getMonth(), daysToApply[0])
          .toISOString()
          .split("T")[0];
        toast.success(`${addedLabel} נשמרו בהצלחה לתאריך ${iso}`);
      } else {
        toast.success(`${addedLabel} נשמרו בהצלחה ל־${daysToApply.length} ימים`);
      }
      setSubmitting(false);
      // reset only selected types; keep the date for convenience, but clear range
      setSelectedTypes([]);
      setCommittedRange(null);
    }, 700);
  };

  const onPublish = () => {
    const count = Object.values(savedShifts).reduce((acc, arr) => acc + (arr?.length ?? 0), 0);
    if (count === 0) {
      toast.error("אין משמרות לפרסום");
      return;
    }
    setPublishing(true);
    setTimeout(() => {
      toast.success(`פורסמו ${count} משמרות לחודש הבא`);
      setPublishing(false);
    }, 900);
  };

  const onReset = () => {
    // Clear all local selections and persisted shifts for this month
    setSavedShifts({});
    setSelectedTypes([]);
    setCommittedRange(null);
    setIsDragging(false);
    setDragStartDay(null);
    setDragCurrentDay(null);
    setSelectedDate(start);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // ignore storage errors
    }
    toast.success("היומן אופס בהצלחה");
    setConfirmOpen(false);
  };

  const makeIsoForDay = (day: number) =>
    new Date(start.getFullYear(), start.getMonth(), day).toISOString().split("T")[0];

  // Global pointer up to finish drag even if pointer leaves grid
  useEffect(() => {
    const onUp = () => {
      if (isDragging && dragStartDay != null && dragCurrentDay != null) {
        const s = Math.max(1, Math.min(dragStartDay, dragCurrentDay));
        const e = Math.min(daysInMonth, Math.max(dragStartDay, dragCurrentDay));
        setCommittedRange({ start: s, end: e });
      }
      setIsDragging(false);
      setDragStartDay(null);
      setDragCurrentDay(null);
    };
    if (isDragging) {
      window.addEventListener("pointerup", onUp);
      window.addEventListener("mouseup", onUp);
      return () => {
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("mouseup", onUp);
      };
    }
  }, [isDragging, dragStartDay, dragCurrentDay, daysInMonth]);

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">הוספת משמרת - חודש הבא</h2>
        </div>

        <Card className="w-full">
        <CardHeader>
          <CardTitle>בחר/י יום במשבצת ולאחר מכן סוג משמרת</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <label className="text-sm text-muted-foreground">
                תאריך (בחודש הבא)
              </label>
              <div className="rounded-lg border border-card-border bg-card p-4 select-none">
                <div className="grid grid-cols-7 gap-px bg-card-border rounded-lg overflow-hidden border border-card-border">
                  {weekDays.map((day, i) => (
                    <div key={i} className="bg-accent p-2 text-center text-sm font-medium">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const iso = makeIsoForDay(day);
                    const types = savedShifts[iso] ?? [];
                    const isSelectedSingle = selectedDate && selectedDate.getDate() === day;
                    const isInRange = selectedDaysSet.has(day);
                    const dayBadgeClass = "w-6 h-6 rounded-full flex items-center justify-center text-xs";

                    return (
                      <button
                        type="button"
                        key={day}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                          setCommittedRange(null);
                          setDragStartDay(day);
                          setDragCurrentDay(day);
                          // also keep selectedDate anchored to drag start for context
                          setSelectedDate(new Date(start.getFullYear(), start.getMonth(), day));
                        }}
                        onPointerEnter={() => {
                          if (isDragging) setDragCurrentDay(day);
                        }}
                        onClick={() => {
                          // If not dragging, treat as single click selection
                          if (!isDragging) {
                            setCommittedRange(null);
                            setSelectedDate(new Date(start.getFullYear(), start.getMonth(), day));
                          }
                        }}
                        className={`bg-card min-h-[80px] p-2 text-right hover:bg-accent/50 transition-colors focus:outline-none ${
                          isInRange ? "bg-primary/10 ring-1 ring-primary/60" : isSelectedSingle ? "ring-1 ring-primary/60" : ""
                        }`}
                      >
                        <div className="flex justify-end">
                          <div className={dayBadgeClass}>{day}</div>
                        </div>
                        {/* shift dots */}
                        {types.length > 0 && (
                          <div className="mt-2 flex gap-1 justify-end">
                            {types.includes("morning") && (
                              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" title="בוקר" />
                            )}
                            {types.includes("evening") && (
                              <span className="inline-block w-3 h-3 rounded-full bg-amber-500" title="ערב" />
                            )}
                            {types.includes("night") && (
                              <span className="inline-block w-3 h-3 rounded-full bg-violet-500" title="לילה" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                ניתן לבחור תאריך בין {startISO} ל־{endISO}
              </span>
              {/* Multi-day selection info and clear */}
              {selectedDaysSet.size > 1 && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">נבחרו {selectedDaysSet.size} ימים</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setCommittedRange(null)}>
                    נקה בחירה
                  </Button>
                </div>
              )}
              {/* Legend */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-foreground">בוקר</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-foreground">ערב</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-violet-500" />
                  <span className="text-foreground">לילה</span>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-muted-foreground">סוג משמרת</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" className="justify-between">
                    {selectedTypes.length === 0
                      ? "בחר/י סוג משמרת"
                      : selectedTypes.length === 3
                      ? "כל המשמרות"
                      : selectedTypes.map((t) => labelMap[t]).join(", ")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                  {/* Select All */}
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.length === 3}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTypes(["morning", "evening", "night"]);
                      } else {
                        setSelectedTypes([]);
                      }
                    }}
                  >
                    הכל
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("morning")}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) => {
                      setSelectedTypes((prev) => {
                        const set = new Set(prev);
                        if (checked) set.add("morning"); else set.delete("morning");
                        return Array.from(set);
                      });
                    }}
                  >
                    בוקר
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("evening")}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) => {
                      setSelectedTypes((prev) => {
                        const set = new Set(prev);
                        if (checked) set.add("evening"); else set.delete("evening");
                        return Array.from(set);
                      });
                    }}
                  >
                    ערב
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("night")}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) => {
                      setSelectedTypes((prev) => {
                        const set = new Set(prev);
                        if (checked) set.add("night"); else set.delete("night");
                        return Array.from(set);
                      });
                    }}
                  >
                    לילה
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {selectedDate && (
                <span className="text-xs text-muted-foreground">
                  תאריך נבחר: {selectedDate.toISOString().split("T")[0]}
                </span>
              )}

              {/* Chips for selected day */}
              {selectedDate && (
                (() => {
                  const iso = selectedDate.toISOString().split("T")[0];
                  const types = savedShifts[iso] ?? [];
                  if (types.length === 0) return null;
                  const chip = (label: string, color: string, value: ShiftType) => (
                    <span
                      key={value}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${color} bg-transparent`}
                    >
                      {label}
                      <button
                        type="button"
                        className="ml-1 opacity-70 hover:opacity-100"
                        aria-label={`הסר ${label}`}
                        onClick={() => {
                          setSavedShifts((prev) => {
                            const arr = (prev[iso] ?? []).filter((t) => t !== value);
                            const next = { ...prev } as Record<string, ShiftType[]>;
                            if (arr.length > 0) next[iso] = arr; else delete next[iso];
                            return next;
                          });
                        }}
                      >
                        ×
                      </button>
                    </span>
                  );
                  return (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {types.includes("morning") && chip("בוקר", "border-emerald-500 text-emerald-400", "morning")}
                      {types.includes("evening") && chip("ערב", "border-amber-500 text-amber-400", "evening")}
                      {types.includes("night") && chip("לילה", "border-violet-500 text-violet-400", "night")}
                    </div>
                  );
                })()
              )}
            </div>

            {/* Breakdown of selected shifts */}
            <div className="mt-2 border-t pt-3">
              <div className="text-sm font-medium mb-2 text-foreground">פירוט משמרות שנבחרו</div>
              <div className="text-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
                  <span>בוקר: {totals.morning}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
                  <span>ערב: {totals.evening}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-violet-500" />
                  <span>לילה: {totals.night}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Button type="submit" disabled={submitting || selectedTypes.length === 0 || !selectedDate} className="min-w-32">
                {submitting ? "שומר..." : "שמור משמרת"}
              </Button>
              <Button
                type="button"
                onClick={onPublish}
                disabled={
                  publishing ||
                  Object.values(savedShifts).reduce((acc, arr) => acc + (arr?.length ?? 0), 0) === 0
                }
                className="min-w-32 border border-primary bg-transparent text-primary hover:bg-primary/10"
              >
                {publishing ? "מפרסם..." : "פרסם"}
              </Button>
              <Popover open={confirmOpen} onOpenChange={setConfirmOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={
                      Object.keys(savedShifts).length === 0 &&
                      selectedTypes.length === 0 &&
                      committedRange == null &&
                      !isDragging
                    }
                    className="min-w-24 ms-auto"
                  >
                    איפוס
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72">
                  <div className="space-y-3">
                    <div className="text-sm">
                      אתה בטוח שאתה רוצה לאפס את הטבלה?
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Button type="button" variant="ghost" onClick={() => setConfirmOpen(false)}>
                        לא
                      </Button>
                      <Button type="button" variant="destructive" onClick={onReset}>
                        כן, לאפס
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default AddShiftView;
