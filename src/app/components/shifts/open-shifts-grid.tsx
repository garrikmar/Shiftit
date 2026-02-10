import { Shift, ShiftCard } from "../shift-card";

interface OpenShiftsGridProps {
  shifts: Shift[];
  onTakeShift: (shift: Shift) => void;
}

export function OpenShiftsGrid({ shifts, onTakeShift }: OpenShiftsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {shifts.map((shift) => (
        <ShiftCard
          key={shift.id}
          shift={shift}
          onTake={() => onTakeShift(shift)}
        />
      ))}
    </div>
  );
}
