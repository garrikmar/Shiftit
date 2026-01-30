import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useMemo } from "react";
import { TeamMember } from "../data/mock-data";

interface MemberShiftsModalProps {
  member: TeamMember;
  onClose: () => void;
  shifts: { day: number; memberName: string; type: string; title: string; time: string }[];
}

export function MemberShiftsModal({ member, onClose, shifts }: MemberShiftsModalProps) {
  const weekDays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const currentMonth = "ינואר 2026";

  // Filter shifts for this member
  const memberShifts = useMemo(() => {
    return shifts.filter(s => s.memberName === member.name).sort((a, b) => a.day - b.day);
  }, [member, shifts]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl border border-card-border bg-background-secondary shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">
              {member.avatar}
            </div>
            <div>
              <h2 className="text-xl">{member.name}</h2>
              <p className="text-sm text-muted-foreground">{member.role} • {currentMonth}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-accent/50 border border-border">
              <div className="text-xs text-muted-foreground mb-1">סה״כ משמרות</div>
              <div className="text-xl font-bold">{member.stats.shifts}</div>
            </div>
            <div className="p-3 rounded-lg bg-accent/50 border border-border">
              <div className="text-xs text-muted-foreground mb-1">לילות</div>
              <div className="text-xl font-bold">{member.stats.nights}</div>
            </div>
            <div className="p-3 rounded-lg bg-accent/50 border border-border">
              <div className="text-xs text-muted-foreground mb-1">סופי שבוע</div>
              <div className="text-xl font-bold">{member.stats.weekends}</div>
            </div>
            <div className="p-3 rounded-lg bg-accent/50 border border-border">
              <div className="text-xs text-muted-foreground mb-1">הוגנות</div>
              <div className="text-xl font-bold">{member.stats.fairness}%</div>
            </div>
            <div className="p-3 rounded-lg bg-accent/50 border border-border">
              <div className="text-xs text-muted-foreground mb-1">כיסוי</div>
              <div className="text-xl font-bold">{member.stats.coverage}%</div>
            </div>
          </div>

          <div className="rounded-lg border border-card-border bg-card overflow-hidden">
            <div className="grid grid-cols-7 gap-px bg-card-border">
              {weekDays.map((day, i) => (
                <div key={i} className="bg-accent p-2 text-center text-sm font-medium">
                  {day}
                </div>
              ))}
              {/* Jan 2026 starts on Thursday (Index 4 in 0-indexed Sun-Sat) */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-card/50 min-h-[80px]" />
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const dayShifts = memberShifts.filter(s => s.day === day);

                return (
                  <div key={i} className="bg-card min-h-[80px] p-2 border-t border-r border-card-border first:border-r-0">
                    <div className="text-xs mb-1 text-muted-foreground font-medium">
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayShifts.map((shift, idx) => (
                        <div key={`${shift.day}-${idx}`} className={`
                          p-1 rounded text-[10px] border-r-2 transition-colors
                          ${shift.type === 'night' 
                            ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300' 
                            : shift.type === 'evening'
                            ? 'bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-300'
                            : 'bg-primary/10 border-primary text-primary'}
                        `}>
                          <div className="font-bold truncate">{shift.title}</div>
                          <div className="opacity-80">{shift.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Padding for the end of the month */}
              {Array.from({ length: (7 - (31 + 4) % 7) % 7 }).map((_, i) => (
                <div key={`empty-end-${i}`} className="bg-card/50 min-h-[80px]" />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-card flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}
