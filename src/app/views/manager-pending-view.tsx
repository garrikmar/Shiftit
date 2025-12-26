import { ShiftCard, Shift } from "../components/shift-card";
import { FilterChips } from "../components/filter-chips";
import { useState } from "react";
import { EmptyState } from "../components/empty-state";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ManagerPendingViewProps {
  shifts: Shift[];
  onRequestClick: (shift: Shift) => void;
}

export function ManagerPendingView({ shifts, onRequestClick }: ManagerPendingViewProps) {
  const [filters, setFilters] = useState([
    { id: "all", label: "הכל", active: true },
    { id: "urgent", label: "דחוף", active: false },
    { id: "today", label: "היום", active: false },
    { id: "nurse", label: "אחות", active: false },
  ]);

  const pendingRequests = shifts.filter(s => s.status === "pending" && s.requester);
  const urgent = pendingRequests.filter((_, i) => i % 3 === 0);
  const regular = pendingRequests.filter((_, i) => i % 3 !== 0);

  const toggleFilter = (id: string) => {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2>בקשות ממתינות לאישור</h2>
            <span className="text-sm text-muted-foreground">
              {pendingRequests.length} בקשות פתוחות
            </span>
          </div>
          <FilterChips filters={filters} onToggle={toggleFilter} />
        </div>

        {pendingRequests.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="כל הבקשות טופלו"
            description="אין בקשות ממתינות לאישור. עבודה מצוינת!"
          />
        ) : (
          <div className="space-y-6">
            {urgent.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <h3>דחוף - משמרות בימים הקרובים ({urgent.length})</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {urgent.map((shift) => (
                    <div key={shift.id} className="relative">
                      <ShiftCard
                        shift={shift}
                        onClick={() => onRequestClick(shift)}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive border border-destructive/30">
                          דחוף
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {regular.length > 0 && (
              <div>
                <h3 className="mb-4">בקשות רגילות ({regular.length})</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {regular.map((shift) => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onClick={() => onRequestClick(shift)}
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
