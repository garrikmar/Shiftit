import { TrendingUp, Award, Clock, Calendar, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useMemo } from "react";
import { AssignShiftModal } from "../modals/assign-shift-modal";
import { MemberShiftsModal } from "../modals/member-shifts-modal";
import { 
  TeamMember, 
  UncoveredShift, 
  INITIAL_TEAM_MEMBERS, 
  INITIAL_UNCOVERED_SHIFTS, 
  WEEKENDS,
  calculateFairness,
  generateAllShifts
} from "../data/mock-data";

export function TeamView() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [uncoveredShifts, setUncoveredShifts] = useState<UncoveredShift[]>(INITIAL_UNCOVERED_SHIFTS);
  const [selectedShift, setSelectedShift] = useState<UncoveredShift | null>(null);
  const [selectedMemberForShifts, setSelectedMemberForShifts] = useState<TeamMember | null>(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  // Generate all shifts for all members to show in the full calendar
  const allScheduledShifts = useMemo(() => {
    return generateAllShifts(teamMembers, uncoveredShifts);
  }, [teamMembers, uncoveredShifts]);

  // 5. Calculate and Update Fairness Scores for all members
  const teamMembersWithFairness = useMemo(() => {
    return teamMembers.map(member => {
      const memberShifts = allScheduledShifts.filter(s => s.memberName === member.name);
      const newFairness = calculateFairness(member.stats, memberShifts);
      // Recalculate coverage based on 26 shifts target
      const newCoverage = Math.min(100, Math.round((member.stats.shifts / 26) * 100));
      return {
        ...member,
        stats: {
          ...member.stats,
          fairness: newFairness,
          coverage: newCoverage
        }
      };
    });
  }, [teamMembers, allScheduledShifts]);

  const handleAssign = (memberId: string) => {
    if (!selectedShift) return;

    setUncoveredShifts(prev => prev.filter(s => s.id !== selectedShift.id));
    setTeamMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const isNightShift = selectedShift.title.includes("לילה");
        const dateDay = parseInt(selectedShift.date.split("/")[0]);
        const isWeekendShift = WEEKENDS.includes(dateDay);

        return {
          ...member,
          stats: {
            ...member.stats,
            shifts: member.stats.shifts + 1,
            nights: isNightShift ? member.stats.nights + 1 : member.stats.nights,
            weekends: isWeekendShift ? member.stats.weekends + 1 : member.stats.weekends,
          }
        };
      }
      return member;
    }));
    setSelectedShift(null);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h2 className="mb-2">ניהול צוות</h2>
          <p className="text-muted-foreground">מעקב אחר הוגנות וחלוקת משמרות</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">סה״כ משמרות</div>
                <div className="text-2xl">186 / {allScheduledShifts.length}</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">כיסוי ממוצע</div>
                <div className="text-2xl">{Math.round((allScheduledShifts.length / 186) * 100)}%</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">הוגנות</div>
                <div className="text-2xl">
                  {Math.round(teamMembersWithFairness.reduce((acc, m) => acc + m.stats.fairness, 0) / teamMembersWithFairness.length) > 90 ? "מצוינת" : 
                   Math.round(teamMembersWithFairness.reduce((acc, m) => acc + m.stats.fairness, 0) / teamMembersWithFairness.length) > 80 ? "טובה" : "דורשת שיפור"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uncovered Shifts Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h3>משמרות ללא כיסוי</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uncoveredShifts.map((shift) => (
              <div 
                key={shift.id}
                onClick={() => setSelectedShift(shift)}
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 cursor-pointer hover:bg-destructive/10 transition-colors group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-destructive group-hover:underline">{shift.title}</div>
                    <div className="text-sm text-muted-foreground">{shift.date}</div>
                  </div>
                  <div className="text-xs font-bold px-2 py-1 rounded bg-destructive/20 text-destructive">
                    חסר איוש
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{shift.time}</span>
                </div>
              </div>
            ))}
            
            {uncoveredShifts.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground bg-accent/20 rounded-lg border border-dashed border-border">
                כל המשמרות מאוישות כהלכה.
              </div>
            )}
          </div>
        </div>

        {/* Team Calendar */}
        <div className="mb-6 rounded-lg border border-card-border bg-card overflow-hidden">
          <div 
            className="p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-accent/30 transition-colors"
            onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3>לוח איוש חודשי - ינואר 2026</h3>
              {isCalendarExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
            {isCalendarExpanded && (
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>בוקר</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>ערב</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>לילה</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span>ללא כיסוי</span>
                </div>
              </div>
            )}
          </div>
          
          {isCalendarExpanded && (
            <>
              <div className="p-4 overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-7 gap-px bg-card-border border border-card-border rounded-lg overflow-hidden">
                    {["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"].map((day, i) => (
                      <div key={i} className="bg-accent p-2 text-center text-sm font-medium">
                        {day}
                      </div>
                    ))}
                    {/* Jan 2026 starts on Thursday (Index 4) */}
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={`empty-${i}`} className="bg-card/50 min-h-[120px]" />
                    ))}
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${day.toString().padStart(2, '0')}/01/2026`;
                      const dayShifts = allScheduledShifts.filter(s => s.day === day);
                      const dayUncovered = uncoveredShifts.filter(s => s.date === dateStr);

                      return (
                        <div key={i} className="bg-card min-h-[120px] p-2 border-t border-r border-card-border first:border-r-0 hover:bg-accent/10 transition-colors">
                          <div className="text-xs mb-2 text-muted-foreground font-medium flex justify-between">
                            <span>{day}</span>
                            {dayUncovered.length > 0 && (
                              <span className="text-[10px] text-destructive font-bold animate-pulse">חסר איוש</span>
                            )}
                          </div>
                          <div className="space-y-2">
                            {/* Group shifts by type to show 2 people per shift */}
                            {["morning", "evening", "night"].map(type => {
                              const shiftsOfType = dayShifts.filter(s => s.type === type);
                              const uncoveredOfType = dayUncovered.filter(s => 
                                (type === 'morning' && s.title.includes('בוקר')) || 
                                (type === 'evening' && s.title.includes('ערב')) || 
                                (type === 'night' && s.title.includes('לילה'))
                              );
                              
                              const missingOfType = uncoveredOfType.length;
                              
                              if (shiftsOfType.length === 0 && missingOfType === 0) return null;

                              return (
                                <div key={type} className={`
                                  p-1 rounded text-[9px] border-r-2 transition-colors
                                  ${type === 'night' 
                                    ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300' 
                                    : type === 'evening'
                                    ? 'bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-300'
                                    : 'bg-primary/10 border-primary text-primary'}
                                `}>
                                  <div className="font-bold flex justify-between">
                                    <span>{type === 'morning' ? 'בוקר' : type === 'evening' ? 'ערב' : 'לילה'}</span>
                                    {missingOfType > 0 && <span className="text-destructive animate-pulse">חסר ({missingOfType})</span>}
                                  </div>
                                  <div className="opacity-80">
                                    {shiftsOfType.map(s => s.memberName).join(', ')}
                                    {missingOfType > 0 && (shiftsOfType.length > 0 ? ', ' : '') + 'חסר איוש'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {/* Padding for the end of the month */}
                    {Array.from({ length: (7 - (31 + 4) % 7) % 7 }).map((_, i) => (
                      <div key={`empty-end-${i}`} className="bg-card/50 min-h-[120px]" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-accent/30 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>הלוח מציג את כל שיבוצי הצוות ומשמרות פתוחות. לחצו על משמרת חסרה כדי לשבץ איש צוות.</span>
              </div>
            </>
          )}
        </div>

        {/* Team Members Table */}
        <div className="rounded-lg border border-card-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3>חברי הצוות</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr className="text-right">
                  <th className="px-4 py-3">שם</th>
                  <th className="px-4 py-3">תפקיד</th>
                  <th className="px-4 py-3">משמרות</th>
                  <th className="px-4 py-3">לילות</th>
                  <th className="px-4 py-3">סופ״ש</th>
                  <th className="px-4 py-3">הוגנות</th>
                  <th className="px-4 py-3">כיסוי</th>
                </tr>
              </thead>
              <tbody>
                {teamMembersWithFairness.map((member, index) => (
                  <tr
                    key={member.id}
                    onClick={() => setSelectedMemberForShifts(member)}
                    className={`border-t border-border hover:bg-accent/30 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-accent/10" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {member.avatar}
                        </div>
                        <span>{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{member.role}</td>
                    <td className="px-4 py-4">{member.stats.shifts}</td>
                    <td className="px-4 py-4">{member.stats.nights}</td>
                    <td className="px-4 py-4">{member.stats.weekends}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className={`h-full rounded-full ${
                              member.stats.fairness > 90 ? "bg-primary" : 
                              member.stats.fairness > 80 ? "bg-secondary" : "bg-warning"
                            }`}
                            style={{ width: `${member.stats.fairness}%` }}
                          />
                        </div>
                        <span className="text-sm">{member.stats.fairness}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${member.stats.coverage}%` }}
                          />
                        </div>
                        <span className="text-sm">{member.stats.coverage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fairness Insights */}
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="mb-1 text-primary">תובנות איוש והוגנות</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-bold text-muted-foreground uppercase">כיסוי וזמינות</div>
                    <p className="text-sm text-foreground">
                      רמת הכיסוי הנוכחית היא {Math.round((allScheduledShifts.length / 186) * 100)}%. קיימות {uncoveredShifts.length} משמרות ללא כיסוי שדורשות התייחסות מיידית.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-bold text-muted-foreground uppercase">הוגנות וחלוקה</div>
                    <p className="text-sm text-foreground">
                      ציון ההוגנות הממוצע הוא {Math.round(teamMembersWithFairness.reduce((acc, m) => acc + m.stats.fairness, 0) / teamMembersWithFairness.length)}%. חלוקת הלילות והסופ״שים מתבצעת באופן שקוף ודינמי לכל חברי הצוות.
                      {teamMembersWithFairness.some(m => m.stats.fairness < 80) && (
                        <span className="block mt-1 text-warning font-medium">
                          שימו לב: {teamMembersWithFairness.filter(m => m.stats.fairness < 80).map(m => m.name).join(', ')} עם ציון הוגנות נמוך מ-80%.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {uncoveredShifts.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-1" />
                <div>
                  <h4 className="mb-1 text-destructive">התראות דחופות</h4>
                  <p className="text-sm text-foreground">
                    ישנן {uncoveredShifts.length} משמרות פתוחות בינואר 2026. מומלץ לשבץ את אנשי הצוות עם רמת הכיסוי הנמוכה ביותר או אלו עם ציון הוגנות גבוה לאיזון העומס.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assignment Modal */}
        {selectedShift && (
          <AssignShiftModal
            shift={{
              title: selectedShift.title,
              date: selectedShift.date,
              time: selectedShift.time,
            }}
            teamMembers={teamMembersWithFairness}
            onClose={() => setSelectedShift(null)}
            onAssign={handleAssign}
            allScheduledShifts={allScheduledShifts}
          />
        )}

        {/* Member Shifts Calendar Modal */}
        {selectedMemberForShifts && (
          <MemberShiftsModal
            member={teamMembersWithFairness.find(m => m.id === selectedMemberForShifts.id) || selectedMemberForShifts}
            onClose={() => setSelectedMemberForShifts(null)}
            shifts={allScheduledShifts}
          />
        )}
      </div>
    </div>
  );
}
