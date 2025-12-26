import { ShiftCard, Shift } from "../components/shift-card";
import { FilterChips } from "../components/filter-chips";
import { useState } from "react";
import { EmptyState } from "../components/empty-state";
import { Briefcase } from "lucide-react";

interface OpenShiftsViewProps {
  shifts: Shift[];
  onTakeShift: (shift: Shift) => void;
}

export function OpenShiftsView({ shifts, onTakeShift }: OpenShiftsViewProps) {
  const [filters, setFilters] = useState([
    { id: "all", label: "הכל", active: true },
    { id: "nurse", label: "אחות", active: false },
    { id: "morning", label: "בוקר", active: false },
    { id: "evening", label: "ערב", active: false },
    { id: "night", label: "לילה", active: false },
  ]);

  const openShifts = shifts.filter(s => s.status === "open");

  const toggleFilter = (id: string) => {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2>משמרות פתוחות</h2>
            <span className="text-sm text-muted-foreground">
              {openShifts.length} משמרות זמינות
            </span>
          </div>
          <FilterChips filters={filters} onToggle={toggleFilter} />
        </div>

        {openShifts.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="אין משמרות פתוחות כרגע"
            description="כל המשמרות מאוישות. בדוק/י שוב מאוחר יותר או צור/י קשר עם המנהל/ת."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openShifts.map((shift) => (
              <div key={shift.id} className="relative">
                <ShiftCard
                  shift={shift}
                  onClick={() => {}}
                />
                <button
                  onClick={() => onTakeShift(shift)}
                  className="absolute bottom-4 left-4 right-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary-glow/30 transition-all"
                >
                  לקיחת משמרת
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
