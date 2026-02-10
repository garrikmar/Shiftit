import { ChevronRight, ChevronLeft } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentMonth,
  onPrevious,
  onNext,
  onToday,
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
    </div>
  );
}
