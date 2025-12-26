import { ShiftCard, Shift } from "../components/shift-card";
import { FilterChips } from "../components/filter-chips";
import { useState } from "react";
import { EmptyState } from "../components/empty-state";
import { Calendar } from "lucide-react";

interface MyShiftsViewProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
  onCancelShift: (shift: Shift) => void;
}

export function MyShiftsView({ shifts, onShiftClick, onCancelShift }: MyShiftsViewProps) {
  const [filters, setFilters] = useState([
    { id: "all", label: "הכל", active: true },
    { id: "upcoming", label: "קרובות", active: false },
    { id: "morning", label: "בוקר", active: false },
    { id: "evening", label: "ערב", active: false },
    { id: "night", label: "לילה", active: false },
  ]);

  const myShifts = shifts.filter(s => s.status === "scheduled" || s.status === "pending");

  const toggleFilter = (id: string) => {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h2 className="mb-4">סינון משמרות</h2>
          <FilterChips filters={filters} onToggle={toggleFilter} />
        </div>

        {myShifts.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="אין משמרות קרובות"
            description="כרגע אין לך משמרות מתוכננות. בדוק/י את המשמרות הפתוחות או פנה/י למנהל/ת."
            action={{
              label: "צפייה במשמרות פתוחות",
              onClick: () => {},
            }}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="mb-3 text-muted-foreground">השבוע</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myShifts.slice(0, 4).map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    onClick={() => onShiftClick(shift)}
                    showActions
                    onCancel={() => onCancelShift(shift)}
                  />
                ))}
              </div>
            </div>

            {myShifts.length > 4 && (
              <div>
                <h3 className="mb-3 text-muted-foreground">השבוע הבא</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myShifts.slice(4).map((shift) => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onClick={() => onShiftClick(shift)}
                      showActions
                      onCancel={() => onCancelShift(shift)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
