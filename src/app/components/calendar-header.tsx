import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  view: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
}

export function CalendarHeader({
  currentMonth,
  onPrevious,
  onNext,
  onToday,
  view,
  onViewChange,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Month & Navigation */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl">{currentMonth}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevious}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={onToday}
          className="px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
        >
          היום
        </button>
      </div>

      {/* View Selector */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-accent border border-border">
        <button
          onClick={() => onViewChange("day")}
          className={`px-4 py-2 rounded-md transition-all ${
            view === "day"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          יום
        </button>
        <button
          onClick={() => onViewChange("week")}
          className={`px-4 py-2 rounded-md transition-all ${
            view === "week"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          שבוע
        </button>
        <button
          onClick={() => onViewChange("month")}
          className={`px-4 py-2 rounded-md transition-all ${
            view === "month"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          חודש
        </button>
      </div>
    </div>
  );
}
