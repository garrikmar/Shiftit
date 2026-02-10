import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ShiftType } from "./types";
import { ShiftLegend } from "./shift-legend";

function formatDateLocal(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface AddShiftCalendarProps {
  start: Date;
  daysInMonth: number;
  startDisplay: string;
  endDisplay: string;
  savedShifts: Record<string, ShiftType[]>;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
  committedRange: { start: number; end: number } | null;
  onCommitRange: (range: { start: number; end: number } | null) => void;
}

export function AddShiftCalendar({
  start,
  daysInMonth,
  startDisplay,
  endDisplay,
  savedShifts,
  selectedDate,
  onSelectDate,
  committedRange,
  onCommitRange,
}: AddShiftCalendarProps) {
  const weekDays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDay, setDragStartDay] = useState<number | null>(null);
  const [dragCurrentDay, setDragCurrentDay] = useState<number | null>(null);

  const activeRange = useMemo(() => {
    if (!isDragging || dragStartDay == null || dragCurrentDay == null) return null;
    const startD = Math.max(1, Math.min(dragStartDay, dragCurrentDay));
    const endD = Math.min(daysInMonth, Math.max(dragStartDay, dragCurrentDay));
    return { start: startD, end: endD };
  }, [isDragging, dragStartDay, dragCurrentDay, daysInMonth]);

  const displaySelectedDaysSet = useMemo(() => {
    const set = new Set<number>();
    if (activeRange) {
      for (let d = activeRange.start; d <= activeRange.end; d++) set.add(d);
    } else if (committedRange) {
      for (let d = committedRange.start; d <= committedRange.end; d++) set.add(d);
    } else if (selectedDate) {
      set.add(selectedDate.getDate());
    }
    return set;
  }, [activeRange, committedRange, selectedDate]);

  useEffect(() => {
    const onUp = () => {
      if (isDragging && dragStartDay != null && dragCurrentDay != null) {
        const s = Math.max(1, Math.min(dragStartDay, dragCurrentDay));
        const e = Math.min(daysInMonth, Math.max(dragStartDay, dragCurrentDay));
        onCommitRange({ start: s, end: e });
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
  }, [isDragging, dragStartDay, dragCurrentDay, daysInMonth, onCommitRange]);

  const makeIsoForDay = (day: number) =>
    formatDateLocal(new Date(start.getFullYear(), start.getMonth(), day));

  return (
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
            const isInRange = displaySelectedDaysSet.has(day);
            const dayBadgeClass = "w-6 h-6 rounded-full flex items-center justify-center text-xs";

            return (
              <button
                type="button"
                key={day}
                onPointerDown={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                  onCommitRange(null);
                  setDragStartDay(day);
                  setDragCurrentDay(day);
                  onSelectDate(new Date(start.getFullYear(), start.getMonth(), day));
                }}
                onPointerEnter={() => {
                  if (isDragging) setDragCurrentDay(day);
                }}
                onClick={() => {
                  if (!isDragging) {
                    onCommitRange(null);
                    onSelectDate(new Date(start.getFullYear(), start.getMonth(), day));
                  }
                }}
                className={`bg-card min-h-[80px] p-2 text-right hover:bg-accent/50 transition-colors focus:outline-none ${
                  isInRange ? "bg-primary/10 ring-1 ring-primary/60" : isSelectedSingle ? "ring-1 ring-primary/60" : ""
                }`}
              >
                <div className="flex justify-end">
                  <div className={dayBadgeClass}>{day}</div>
                </div>
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
        ניתן לבחור תאריך בין {startDisplay} ל־{endDisplay}
      </span>
      
      {(committedRange || isDragging) && displaySelectedDaysSet.size > 1 && (
         <div className="mt-2 flex items-center justify-between text-sm">
           <span className="text-muted-foreground">נבחרו {displaySelectedDaysSet.size} ימים</span>
           <Button type="button" variant="ghost" size="sm" onClick={() => onCommitRange(null)}>
             נקה בחירה
           </Button>
         </div>
      )}
      
      <ShiftLegend />
    </div>
  );
}
