import { TeamMember } from "../../data/mock-data";

interface TeamMemberWithMonthlyStats extends TeamMember {
  stats: TeamMember["stats"] & {
    monthlyShifts?: number;
    monthlyNights?: number;
    monthlyWeekends?: number;
  };
}

interface TeamMembersTableProps {
  teamMembersWithFairness: TeamMemberWithMonthlyStats[];
  onSelectMember: (member: TeamMember) => void;
  selectedMonthName?: string;
}

export function TeamMembersTable({ teamMembersWithFairness, onSelectMember, selectedMonthName }: TeamMembersTableProps) {
  return (
    <div className="rounded-lg border border-card-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3>חברי הצוות {selectedMonthName ? `- ${selectedMonthName}` : ""}</h3>
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
                onClick={() => onSelectMember(member)}
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
                <td className="px-4 py-4">{member.stats.monthlyShifts ?? member.stats.shifts}</td>
                <td className="px-4 py-4">{member.stats.monthlyNights ?? member.stats.nights}</td>
                <td className="px-4 py-4">{member.stats.monthlyWeekends ?? member.stats.weekends}</td>
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
  );
}
