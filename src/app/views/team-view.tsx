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

// Define months outside component to ensure stable reference
const MONTHS = [
  { name: "ינואר 2026", month: 0, year: 2026 },
  { name: "פברואר 2026", month: 1, year: 2026 },
  { name: "מרץ 2026", month: 2, year: 2026 },
];

export function TeamView() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [uncoveredShifts, setUncoveredShifts] = useState<UncoveredShift[]>(INITIAL_UNCOVERED_SHIFTS);
  const [selectedShift, setSelectedShift] = useState<UncoveredShift | null>(null);
  const [selectedMemberForShifts, setSelectedMemberForShifts] = useState<TeamMember | null>(null);
  const [openMonth, setOpenMonth] = useState<string>("month-2"); // Default to March (index 2)

  // Get the selected month based on open accordion item
  const selectedMonthData = useMemo(() => {
    if (!openMonth) {
      // Default to March if no month is selected
      return MONTHS[2];
    }
    const monthIndex = parseInt(openMonth.replace("month-", ""));
    return MONTHS[monthIndex] || MONTHS[2];
  }, [openMonth]);

  // Generate all shifts for all members to show in the full calendar
  const allScheduledShifts = useMemo(() => {
    // Generate shifts for the selected month
    return generateAllShifts(teamMembers, uncoveredShifts, selectedMonthData.month, selectedMonthData.year);
  }, [teamMembers, uncoveredShifts, selectedMonthData]);

  // Filter uncovered shifts for the selected month
  const monthlyUncoveredShifts = useMemo(() => {
    const monthStr = (selectedMonthData.month + 1).toString().padStart(2, '0');
    const yearStr = selectedMonthData.year.toString();
    return uncoveredShifts.filter(shift => {
      // Date format is "DD/MM/YYYY"
      const parts = shift.date.split('/');
      return parts[1] === monthStr && parts[2] === yearStr;
    });
  }, [uncoveredShifts, selectedMonthData]);

  // Calculate and Update Fairness Scores for all members based on selected month
  const teamMembersWithFairness = useMemo(() => {
    // First, calculate each member's monthly shifts
    const memberShiftsMap = new Map<string, { 
      shifts: typeof allScheduledShifts; 
      count: number;
      nights: number;
      weekends: number;
    }>();
    
    teamMembers.forEach(member => {
      const memberShifts = allScheduledShifts.filter(s => s.memberName === member.name);
      memberShiftsMap.set(member.id, {
        shifts: memberShifts,
        count: memberShifts.length,
        nights: memberShifts.filter(s => s.type === 'night').length,
        weekends: memberShifts.filter(s => {
          const dayOfWeek = new Date(selectedMonthData.year, selectedMonthData.month, s.day).getDay();
          return dayOfWeek === 5 || dayOfWeek === 6;
        }).length
      });
    });
    
    // Calculate the average shifts across all team members and round UP
    const allShiftCounts = Array.from(memberShiftsMap.values()).map(m => m.count);
    const averageShifts = allShiftCounts.length > 0 
      ? allShiftCounts.reduce((sum, count) => sum + count, 0) / allShiftCounts.length 
      : 0;
    const targetShifts = Math.ceil(averageShifts); // Round up the average
    
    return teamMembers.map(member => {
      const memberData = memberShiftsMap.get(member.id)!;
      const newFairness = calculateFairness(member.stats, memberData.shifts);
      
      // Coverage is calculated as: (member's shifts / rounded-up average) * 100
      // This ensures that if someone has 21 shifts and another has 20, and average is 20.5,
      // target becomes 21, so person with 21 gets 100% and person with 20 gets ~95%
      const newCoverage = targetShifts > 0 
        ? Math.min(100, Math.round((memberData.count / targetShifts) * 100))
        : 100;
      
      return {
        ...member,
        stats: {
          ...member.stats,
          fairness: newFairness,
          coverage: newCoverage,
          // Add monthly-specific stats
          monthlyShifts: memberData.count,
          monthlyNights: memberData.nights,
          monthlyWeekends: memberData.weekends
        }
      };
    });
  }, [teamMembers, allScheduledShifts, selectedMonthData]);

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
          months={MONTHS}
          teamMembers={teamMembers}
          uncoveredShifts={uncoveredShifts}
          onSelectUncoveredShift={setSelectedShift}
          openMonth={openMonth}
          onOpenMonthChange={setOpenMonth}
        />

        <TeamMembersTable 
          teamMembersWithFairness={teamMembersWithFairness}
          onSelectMember={setSelectedMemberForShifts}
          selectedMonthName={selectedMonthData.name}
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
