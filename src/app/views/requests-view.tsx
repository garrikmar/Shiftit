import { ShiftCard, Shift } from "../components/shift-card";
import { EmptyState } from "../components/empty-state";
import { FileText } from "lucide-react";

interface RequestsViewProps {
  shifts: Shift[];
  onRequestClick: (shift: Shift) => void;
}

export function RequestsView({ shifts, onRequestClick }: RequestsViewProps) {
  const myRequests = shifts.filter(s => s.status === "pending" || s.status === "approved" || s.status === "rejected");
  const pending = myRequests.filter(s => s.status === "pending");
  const resolved = myRequests.filter(s => s.status === "approved" || s.status === "rejected");

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h2 className="mb-2">הבקשות שלי</h2>
          <p className="text-muted-foreground">מעקב אחר סטטוס בקשות והחלפות</p>
        </div>

        {myRequests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="אין בקשות פעילות"
            description="כרגע אין לך בקשות החלפה פעילות. כשתבקש/י החלפה, היא תופיע כאן."
          />
        ) : (
          <div className="space-y-6">
            {pending.length > 0 && (
              <div>
                <h3 className="mb-4">בקשות ממתינות ({pending.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pending.map((shift) => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onClick={() => onRequestClick(shift)}
                    />
                  ))}
                </div>
              </div>
            )}

            {resolved.length > 0 && (
              <div>
                <h3 className="mb-4">בקשות קודמות</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resolved.map((shift) => (
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
