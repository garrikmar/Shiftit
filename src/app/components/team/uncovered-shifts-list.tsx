import { AlertCircle, Clock } from "lucide-react";
import { UncoveredShift } from "../../data/mock-data";

interface UncoveredShiftsListProps {
  uncoveredShifts: UncoveredShift[];
  onSelectShift: (shift: UncoveredShift) => void;
}

export function UncoveredShiftsList({ uncoveredShifts, onSelectShift }: UncoveredShiftsListProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-destructive" />
        <h3>משמרות ללא כיסוי</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uncoveredShifts.map((shift) => (
          <div 
            key={shift.id}
            onClick={() => onSelectShift(shift)}
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 cursor-pointer hover:bg-destructive/10 transition-colors group"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-destructive group-hover:underline">{shift.title}</div>
                <div className="text-sm text-muted-foreground">{shift.date}</div>
              </div>
              <div className="text-xs font-bold px-2 py-1 rounded bg-destructive/20 text-destructive">
                חסר איוש
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground" dir="ltr">
              <Clock className="w-4 h-4" />
              <span>{shift.time}</span>
            </div>
          </div>
        ))}
        
        {uncoveredShifts.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground bg-accent/20 rounded-lg border border-dashed border-border">
            כל המשמרות מאוישות כהלכה.
          </div>
        )}
      </div>
    </div>
  );
}
