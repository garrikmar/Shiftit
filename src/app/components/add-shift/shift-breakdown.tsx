import { useMemo } from "react";
import { ShiftType } from "./types";

interface ShiftBreakdownProps {
  savedShifts: Record<string, ShiftType[]>;
}

export function ShiftBreakdown({ savedShifts }: ShiftBreakdownProps) {
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

  return (
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
  );
}
