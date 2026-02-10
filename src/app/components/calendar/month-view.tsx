import { Shift } from "../shift-card";

interface MonthViewProps {
  monthInfo: {
    year: number;
    month: number; // 0-11
    daysInMonth: number;
  };
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
}

export function MonthView({ monthInfo, shifts, onShiftClick }: MonthViewProps) {
  const weekDays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <div className="grid grid-cols-7 gap-px bg-card-border rounded-lg overflow-hidden border border-card-border">
        {weekDays.map((day, i) => (
          <div key={i} className="bg-accent p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        {Array.from({ length: monthInfo.daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${day
            .toString()
            .padStart(2, "0")}/${(monthInfo.month + 1)
            .toString()
            .padStart(2, "0")}/${monthInfo.year}`;
          const shift = shifts.find((s) => s.date === dateStr);

          return (
            <div key={i} className="bg-card min-h-[100px] p-2 hover:bg-accent/50 transition-colors">
              <div
                className={`text-sm mb-1 ${
                  shift
                    ? `w-6 h-6 rounded-full flex items-center justify-center ${
                        shift.title.includes("לילה")
                          ? "bg-purple-500 text-white"
                          : shift.title.includes("ערב")
                          ? "bg-orange-500 text-white"
                          : "bg-primary text-primary-foreground"
                      }`
                    : ""
                }`}
              >
                {day}
              </div>
              {shift && (
                <div
                  onClick={() => onShiftClick(shift)}
                  className={`p-1 rounded border-r-2 cursor-pointer transition-colors mb-1 ${
                    shift.title.includes("לילה")
                      ? "bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20"
                      : shift.title.includes("ערב")
                      ? "bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20"
                      : "bg-primary/10 border-primary text-primary hover:bg-primary/20"
                  }`}
                >
                  <div className="text-[10px] font-medium truncate">{shift.title}</div>
                  <div
                    className={`text-[10px] truncate ${
                      shift.title.includes("לילה") || shift.title.includes("ערב")
                        ? "opacity-90"
                        : "text-muted-foreground"
                    }`}
                    dir="ltr"
                  >
                    {shift.startTime}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
