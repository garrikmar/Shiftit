import { X, Users, User as UserIcon, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Shift } from "../components/shift-card";
import { useState } from "react";

interface SwapRequestModalProps {
  shift: Shift;
  onClose: () => void;
  onSubmit: (data: { type: "group" | "specific"; reason: string; targetUser?: string }) => void;
}

export function SwapRequestModal({ shift, onClose, onSubmit }: SwapRequestModalProps) {
  const [step, setStep] = useState<"initial" | "details" | "guardrails" | "success">("initial");
  const [swapType, setSwapType] = useState<"group" | "specific">("group");
  const [reason, setReason] = useState("");
  const [targetUser, setTargetUser] = useState("");

  const guardrails = [
    { id: "role", label: "כשירות ותפקיד מתאים", status: "pass" as const, icon: CheckCircle },
    { id: "coverage", label: "כיסוי מינימלי נשמר", status: "pass" as const, icon: CheckCircle },
    { id: "rest", label: "שעות מנוחה מתאימות", status: "warning" as const, icon: AlertCircle },
  ];

  const handleContinue = () => {
    if (step === "initial") {
      setStep("details");
    } else if (step === "details") {
      setStep("guardrails");
    } else if (step === "guardrails") {
      onSubmit({ type: swapType, reason, targetUser });
      setStep("success");
    }
  };

  const renderStep = () => {
    switch (step) {
      case "initial":
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2>בקשת החלפה</h2>
              <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-lg border border-card-border bg-accent p-4 mb-6">
              <h3 className="mb-2">{shift.title}</h3>
              <p className="text-sm text-muted-foreground mb-1">{shift.role}</p>
              <p className="text-sm">
                {shift.date} • {shift.startTime}–{shift.endTime}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSwapType("group");
                  handleContinue();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-right"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="mb-1">פרסום לקבוצה</div>
                  <div className="text-sm text-muted-foreground">
                    המשמרת תפורסם לכל העובדים המתאימים
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSwapType("specific");
                  handleContinue();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-card-border bg-card hover:bg-accent transition-colors text-right"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="mb-1">פנייה לאדם ספציפי</div>
                  <div className="text-sm text-muted-foreground">
                    בחר/י עובד/ת ספציפי/ת להחלפה
                  </div>
                </div>
              </button>
            </div>
          </>
        );

      case "details":
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2>פרטי הבקשה</h2>
              <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {swapType === "specific" && (
              <div className="mb-4">
                <label className="block mb-2">בחר/י עובד/ת</label>
                <select
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:border-primary focus:outline-none"
                >
                  <option value="">-- בחר/י עובד/ת --</option>
                  <option value="דני כהן">דני כהן</option>
                  <option value="שרה לוי">שרה לוי</option>
                  <option value="יוסי אברהם">יוסי אברהם</option>
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="block mb-2">סיבה (אופציונלי)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="הוסף/י הסבר קצר..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:border-primary focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("initial")}
                className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                חזרה
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary-glow/30 transition-all"
              >
                המשך
              </button>
            </div>
          </>
        );

      case "guardrails":
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2>בדיקות אוטומטיות</h2>
              <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {guardrails.map((check) => {
                const Icon = check.icon;
                const isPass = check.status === "pass";
                
                return (
                  <div
                    key={check.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border ${
                      isPass
                        ? "border-primary/30 bg-primary/5"
                        : "border-warning/30 bg-warning/5"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isPass ? "text-primary" : "text-warning"}`} />
                    <span>{check.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-lg bg-accent border border-border mb-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <div className="mb-1">זמן טיפול משוער</div>
                  <div className="text-sm text-muted-foreground">
                    הבקשה תטופל תוך 24 שעות או עד שתימצא החלפה מתאימה
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("details")}
                className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                חזרה
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary-glow/30 transition-all"
              >
                שליחת בקשה
              </button>
            </div>
          </>
        );

      case "success":
        return (
          <>
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="mb-2">הבקשה נשלחה בהצלחה!</h2>
              <p className="text-muted-foreground mb-6">
                {swapType === "group" 
                  ? "המשמרת פורסמה לצוות. תקבל/י התראה כשמישהו/י יגיב/תגיב."
                  : "הבקשה נשלחה לאישור המנהל/ת. תקבל/י עדכון בהקדם."
                }
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary-glow/30 transition-all"
              >
                סגירה
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-card-border bg-background-secondary p-6 shadow-2xl">
        {renderStep()}
      </div>
    </div>
  );
}
