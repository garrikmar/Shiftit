import { X, Clock, User, Check, AlertCircle } from "lucide-react";
import { TeamMember } from "../data/mock-data";

interface AssignShiftModalProps {
  shift: {
    title: string;
    date: string;
    time: string;
  };
  teamMembers: TeamMember[];
  onClose: () => void;
  onAssign: (memberId: string) => void;
  allScheduledShifts: { day: number; memberName: string; type: string; title: string; time: string }[];
}

export function AssignShiftModal({ shift, teamMembers, onClose, onAssign, allScheduledShifts }: AssignShiftModalProps) {
  // Parse current shift info
  const currentDay = parseInt(shift.date.split("/")[0]);
  const currentType = shift.title.includes("בוקר") ? "morning" : 
                      shift.title.includes("ערב") ? "evening" : "night";

  // Sort members by coverage (lowest first) and fairness (highest first) for recommendation
  const recommendedMembers = [...teamMembers]
    .filter(member => {
      // Rule 1: Cannot work the SAME day (already exists in handleAssign but we should hide them here too)
      const worksOnSameDay = allScheduledShifts.some(s => s.memberName === member.name && s.day === currentDay);
      if (worksOnSameDay) return false;

      // Rule 2: Cannot work the NEXT shift immediately after this one
      // Morning (Day D) -> cannot work Evening (Day D)
      // Evening (Day D) -> cannot work Night (Day D)
      // Night (Day D) -> cannot work Morning (Day D+1)
      
      const hasConsecutiveNextConflict = allScheduledShifts.some(s => {
        if (s.memberName !== member.name) return false;
        
        if (currentType === "morning") {
          return s.day === currentDay && s.type === "evening";
        }
        if (currentType === "evening") {
          return s.day === currentDay && s.type === "night";
        }
        if (currentType === "night") {
          return s.day === currentDay + 1 && s.type === "morning";
        }
        return false;
      });

      if (hasConsecutiveNextConflict) return false;

      // Rule 3: Cannot work this shift if they worked the PREVIOUS shift
      // Morning (Day D) -> cannot work if they had Night (Day D-1)
      // Evening (Day D) -> cannot work if they had Morning (Day D)
      // Night (Day D) -> cannot work if they had Evening (Day D)
      const hasConsecutivePrevConflict = allScheduledShifts.some(s => {
        if (s.memberName !== member.name) return false;

        if (currentType === "morning") {
          return s.day === currentDay - 1 && s.type === "night";
        }
        if (currentType === "evening") {
          return s.day === currentDay && s.type === "morning";
        }
        if (currentType === "night") {
          return s.day === currentDay && s.type === "evening";
        }
        return false;
      });

      if (hasConsecutivePrevConflict) return false;

      return true;
    })
    .sort((a, b) => {
    // Primary sort: coverage (lowest first)
    if (a.stats.coverage !== b.stats.coverage) {
      return a.stats.coverage - b.stats.coverage;
    }
    // Secondary sort: fairness (highest first)
    return b.stats.fairness - a.stats.fairness;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-card-border bg-background-secondary p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl">שיבוץ משמרת</h2>
            <p className="text-sm text-muted-foreground">בחרו איש צוות לשיבוץ המשמרת</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shift Summary */}
        <div className="mb-6 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-destructive">{shift.title}</div>
            <div className="text-xs font-bold px-2 py-1 rounded bg-destructive/20 text-destructive">
              טרם שובץ
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground" dir="ltr">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{shift.date} | {shift.time}</span>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            המלצות לשיבוץ (לפי כיסוי והוגנות)
          </h3>
          
          {recommendedMembers.map((member, index) => (
            <div 
              key={member.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                index === 0 
                  ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20" 
                  : "bg-accent/50 border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center relative">
                  {member.avatar}
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 bg-primary text-[8px] px-1 rounded-full text-white">
                      מומלץ
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground flex gap-2">
                    <span>כיסוי: {member.stats.coverage}%</span>
                    <span>|</span>
                    <span>הוגנות: {member.stats.fairness}%</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onAssign(member.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  index === 0
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-accent text-foreground hover:bg-accent-hover border border-border"
                }`}
              >
                <Check className="w-4 h-4" />
                שיבוץ
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}
