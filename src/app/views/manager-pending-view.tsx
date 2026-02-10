import { Shift } from "../components/shift-card";
import { FilterChips } from "../components/filter-chips";
import { useState } from "react";
import { EmptyState } from "../components/empty-state";
import { CheckCircle } from "lucide-react";
import { PendingRequestGroup } from "../components/manager/pending-request-group";

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
            <PendingRequestGroup
              title="דחוף - משמרות בימים הקרובים"
              shifts={urgent}
              isUrgent={true}
              onRequestClick={onRequestClick}
            />
            
            <PendingRequestGroup
              title="בקשות רגילות"
              shifts={regular}
              onRequestClick={onRequestClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
