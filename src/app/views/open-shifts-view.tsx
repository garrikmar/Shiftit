import { ShiftCard, Shift } from "../components/shift-card";
import { FilterChips } from "../components/filter-chips";
import { useState, useMemo } from "react";
import { EmptyState } from "../components/empty-state";
import { Briefcase } from "lucide-react";
import { INITIAL_UNCOVERED_SHIFTS } from "../data/mock-data";

interface OpenShiftsViewProps {
  shifts: Shift[];
  onTakeShift: (shift: Shift) => void;
}

export function OpenShiftsView({ shifts: initialShifts, onTakeShift }: OpenShiftsViewProps) {
  const [filters, setFilters] = useState([
    { id: "all", label: "הכל", active: true },
    { id: "nurse", label: "אחות", active: false },
    { id: "morning", label: "בוקר", active: false },
    { id: "evening", label: "ערב", active: false },
    { id: "night", label: "לילה", active: false },
  ]);

  const openShifts = useMemo(() => {
    return INITIAL_UNCOVERED_SHIFTS.map(s => ({
        id: s.id,
        title: s.title,
        role: "אחות",
        date: s.date,
        startTime: s.time.split(" - ")[0],
        endTime: s.time.split(" - ")[1],
        location: "מחלקה פנימית א׳",
        status: "open" as const
    }));
  }, []);

  const toggleFilter = (id: string) => {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6 min-h-[400px]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
            {openShifts.map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                onTake={() => onTakeShift(shift)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
