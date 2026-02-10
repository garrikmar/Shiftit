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
import { TeamSummaryCards } from "../components/team/team-summary-cards";
import { UncoveredShiftsList } from "../components/team/uncovered-shifts-list";
import { TeamCalendar } from "../components/team/team-calendar";
import { TeamMembersTable } from "../components/team/team-members-table";
import { FairnessInsights } from "../components/team/fairness-insights";

export function TeamView() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [uncoveredShifts, setUncoveredShifts] = useState<UncoveredShift[]>(INITIAL_UNCOVERED_SHIFTS);
  const [selectedShift, setSelectedShift] = useState<UncoveredShift | null>(null);
  const [selectedMemberForShifts, setSelectedMemberForShifts] = useState<TeamMember | null>(null);

  const months = [
    { name: "ינואר 2026", month: 0, year: 2026 },
    { name: "פברואר 2026", month: 1, year: 2026 },
    { name: "מרץ 2026", month: 2, year: 2026 },
  ];

  // Generate all shifts for all members to show in the full calendar
  const allScheduledShifts = useMemo(() => {
    // Generate shifts for March 2026 to synchronize with uncovered shifts and default view
    return generateAllShifts(teamMembers, uncoveredShifts, 2, 2026);
  }, [teamMembers, uncoveredShifts]);

  // Calculate and Update Fairness Scores for all members
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

        <TeamSummaryCards 
          totalShifts={186}
          scheduledShiftsCount={allScheduledShifts.length}
          teamMembersWithFairness={teamMembersWithFairness}
        />

        <UncoveredShiftsList 
          uncoveredShifts={uncoveredShifts}
          onSelectShift={setSelectedShift}
        />

        <TeamCalendar 
          months={months}
          teamMembers={teamMembers}
          uncoveredShifts={uncoveredShifts}
          onSelectUncoveredShift={setSelectedShift}
        />

        <TeamMembersTable 
          teamMembersWithFairness={teamMembersWithFairness}
          onSelectMember={setSelectedMemberForShifts}
        />

        <FairnessInsights 
          totalShifts={186}
          scheduledShiftsCount={allScheduledShifts.length}
          uncoveredShifts={uncoveredShifts}
          teamMembersWithFairness={teamMembersWithFairness}
        />

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
