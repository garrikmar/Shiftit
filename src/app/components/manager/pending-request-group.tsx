import { Shift, ShiftCard } from "../shift-card";
import { AlertCircle } from "lucide-react";

interface PendingRequestGroupProps {
  title: string;
  shifts: Shift[];
  isUrgent?: boolean;
  onRequestClick: (shift: Shift) => void;
}

export function PendingRequestGroup({ title, shifts, isUrgent, onRequestClick }: PendingRequestGroupProps) {
  if (shifts.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {isUrgent && <AlertCircle className="w-5 h-5 text-destructive" />}
        <h3>{title} ({shifts.length})</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {shifts.map((shift) => (
          <div key={shift.id} className="relative">
            <ShiftCard
              shift={shift}
              onClick={() => onRequestClick(shift)}
            />
            {isUrgent && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive border border-destructive/30">
                  דחוף
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
