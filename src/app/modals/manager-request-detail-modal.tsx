import { X, CheckCircle, XCircle, AlertCircle, Users, Clock, Calendar, TrendingUp } from "lucide-react";
import { Shift } from "../components/shift-card";

interface ManagerRequestDetailModalProps {
  shift: Shift;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function ManagerRequestDetailModal({ shift, onClose, onApprove, onReject }: ManagerRequestDetailModalProps) {
  const guardrails = [
    { id: "role", label: "כשירות ותפקיד מתאים", status: "pass" as const },
    { id: "coverage", label: "כיסוי מינימלי במחלקה", status: "pass" as const },
    { id: "rest", label: "שעות מנוחה", status: "warning" as const },
  ];

  const teamFairness = [
    { name: "דני כהן", nights: 4, weekends: 3 },
    { name: "שרה לוי", nights: 5, weekends: 4 },
    { name: shift.replacement || "יוסי אברהם", nights: 3, weekends: 2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-card-border bg-background-secondary p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2>פרטי בקשת החלפה</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shift Details */}
        <div className="rounded-lg border border-card-border bg-card p-4 mb-6">
          <h3 className="mb-4">פרטי המשמרת</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">תאריך</div>
                <div>{shift.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">שעות</div>
                <div dir="ltr">{shift.startTime}–{shift.endTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">תפקיד</div>
                <div>{shift.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Parties Involved */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="text-sm text-muted-foreground mb-2">מבקש/ת</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span>{shift.requester?.charAt(0) || "מ"}</span>
              </div>
              <div>
                <div>{shift.requester || "מיכל אברהם"}</div>
                <div className="text-sm text-muted-foreground">אחות</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="text-sm text-muted-foreground mb-2">מחליף/ה</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <span>{shift.replacement?.charAt(0) || "י"}</span>
              </div>
              <div>
                <div>{shift.replacement || "יוסי אברהם"}</div>
                <div className="text-sm text-muted-foreground">אח</div>
              </div>
            </div>
          </div>
        </div>

        {/* Guardrails Check */}
        <div className="mb-6">
          <h3 className="mb-3">בדיקות אוטומטיות</h3>
          <div className="space-y-2">
            {guardrails.map((check) => {
              const isPass = check.status === "pass";
              const Icon = isPass ? CheckCircle : AlertCircle;
              
              return (
                <div
                  key={check.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isPass
                      ? "border-primary/30 bg-primary/5"
                      : "border-warning/30 bg-warning/5"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isPass ? "text-primary" : "text-warning"}`} />
                  <span className="text-sm">{check.label}</span>
                  {!isPass && (
                    <span className="mr-auto text-xs text-warning">
                      נדרש אישור ידני
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Fairness */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3>הוגנות צוות</h3>
          </div>
          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="space-y-3">
              {teamFairness.map((member) => (
                <div key={member.name} className="flex items-center justify-between">
                  <span>{member.name}</span>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>לילות: {member.nights}</span>
                    <span>סופ״ש: {member.weekends}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors"
          >
            <XCircle className="w-5 h-5" />
            דחייה
          </button>
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary-glow/30 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
