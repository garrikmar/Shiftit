import { Shift, ShiftCard } from "../shift-card";
import { AlertCircle } from "lucide-react";

interface CalendarSidebarProps {
  pendingRequests: Shift[];
  openShifts: Shift[];
  onShiftClick: (shift: Shift) => void;
  onViewOpenShifts: () => void;
}

export function CalendarSidebar({
  pendingRequests,
  openShifts,
  onShiftClick,
  onViewOpenShifts,
}: CalendarSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h3>בקשות ממתינות</h3>
          </div>
          <div className="space-y-3">
            {pendingRequests.map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                onClick={() => onShiftClick(shift)}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Open Shifts */}
      <div className="rounded-lg border border-card-border bg-card p-4">
        <h3 className="mb-4">משמרות פתוחות מומלצות</h3>
        <div className="space-y-3">
          {openShifts.map((shift) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              onClick={() => onShiftClick(shift)}
              compact
            />
          ))}
        </div>
        <button
          onClick={onViewOpenShifts}
          className="w-full mt-4 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
        >
          צפייה בכל המשמרות הפתוחות
        </button>
      </div>
    </div>
  );
}
