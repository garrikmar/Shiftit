import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { toast } from "sonner";
import { AddShiftCalendar } from "../components/add-shift/add-shift-calendar";
import { ShiftMultiSelect } from "../components/add-shift/shift-multi-select";
import { ShiftBreakdown } from "../components/add-shift/shift-breakdown";
import { ShiftType, formatDateLocal, formatDateDisplay, labelMap } from "../components/add-shift/types";

function getNextMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  return { start, end, startDisplay: formatDateDisplay(start), endDisplay: formatDateDisplay(end) };
}

export function AddShiftView() {
  const { start, end, startDisplay, endDisplay } = useMemo(getNextMonthRange, []);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(start);
  const [selectedTypes, setSelectedTypes] = useState<ShiftType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [savedShifts, setSavedShifts] = useState<Record<string, ShiftType[]>>({});
  const [committedRange, setCommittedRange] = useState<{ start: number; end: number } | null>(null);
  const [calendarKey, setCalendarKey] = useState(0); // Force reset of calendar state

  const daysInMonth = end.getDate();

  const storageKey = useMemo(() => {
    const y = start.getFullYear();
    const m = String(start.getMonth() + 1).padStart(2, "0");
    return `addShift:savedShifts:${y}-${m}`;
  }, [start]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, ShiftType[]>;
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
      setSavedShifts({});
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(savedShifts));
      }
    } catch {
      // ignore
    }
  }, [storageKey, savedShifts]);

  // Derived set for onSubmit
  const selectedDaysSet = useMemo(() => {
    const set = new Set<number>();
    const range = committedRange;
    if (range) {
      for (let d = range.start; d <= range.end; d++) set.add(d);
    } else if (selectedDate) {
      set.add(selectedDate.getDate());
    }
    return set;
  }, [committedRange, selectedDate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTypes.length === 0) {
      toast.error("נא לבחור סוג משמרת");
      return;
    }
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
      const toAdd: ShiftType[] = Array.from(new Set(selectedTypes));
      setSavedShifts((prev) => {
        const next: Record<string, ShiftType[]> = { ...prev };
        for (const d of daysToApply) {
          const iso = formatDateLocal(new Date(start.getFullYear(), start.getMonth(), d));
          const existing = next[iso] ?? [];
          const merged = Array.from(new Set<ShiftType>([...existing, ...toAdd]));
          next[iso] = merged;
        }
        return next;
      });

      const addedLabel = toAdd.length === 3 ? "כל המשמרות" : toAdd.map((t) => labelMap[t]).join(", ");
      if (daysToApply.length === 1) {
        const displayDate = formatDateDisplay(new Date(start.getFullYear(), start.getMonth(), daysToApply[0]));
        toast.success(`${addedLabel} נשמרו בהצלחה לתאריך ${displayDate}`);
      } else {
        toast.success(`${addedLabel} נשמרו בהצלחה ל־${daysToApply.length} ימים`);
      }
      setSubmitting(false);
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
    setSavedShifts({});
    setSelectedTypes([]);
    setCommittedRange(null);
    setSelectedDate(start);
    setCalendarKey(prev => prev + 1); // Reset child component state
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // ignore
    }
    toast.success("היומן אופס בהצלחה");
    setConfirmOpen(false);
  };

  const onRemoveShift = (iso: string, value: ShiftType) => {
    setSavedShifts((prev) => {
      const arr = (prev[iso] ?? []).filter((t) => t !== value);
      const next = { ...prev } as Record<string, ShiftType[]>;
      if (arr.length > 0) next[iso] = arr; else delete next[iso];
      return next;
    });
  };

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
              
              <AddShiftCalendar
                key={calendarKey}
                start={start}
                daysInMonth={daysInMonth}
                startDisplay={startDisplay}
                endDisplay={endDisplay}
                savedShifts={savedShifts}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                committedRange={committedRange}
                onCommitRange={setCommittedRange}
              />

              <ShiftMultiSelect 
                selectedTypes={selectedTypes}
                onChange={setSelectedTypes}
                selectedDate={selectedDate}
                savedShifts={savedShifts}
                onRemoveShift={onRemoveShift}
              />

              <ShiftBreakdown savedShifts={savedShifts} />

              <div className="pt-2 flex items-center gap-2">
                <Button type="submit" disabled={submitting || selectedTypes.length === 0 || (!selectedDate && !committedRange)} className="min-w-32">
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
                        committedRange == null
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
