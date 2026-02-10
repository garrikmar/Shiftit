import { TrendingUp, Award, Clock } from "lucide-react";
import { TeamMember } from "../../data/mock-data";

interface TeamSummaryCardsProps {
  totalShifts: number;
  scheduledShiftsCount: number;
  teamMembersWithFairness: TeamMember[];
}

export function TeamSummaryCards({ totalShifts, scheduledShiftsCount, teamMembersWithFairness }: TeamSummaryCardsProps) {
  const avgFairness = Math.round(teamMembersWithFairness.reduce((acc, m) => acc + m.stats.fairness, 0) / teamMembersWithFairness.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="rounded-lg border border-card-border bg-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">סה״כ משמרות</div>
            <div className="text-2xl">{scheduledShiftsCount} / {totalShifts}</div>
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
            <div className="text-2xl">{Math.round((scheduledShiftsCount / totalShifts) * 100)}%</div>
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
              {avgFairness > 90 ? "מצוינת" : avgFairness > 80 ? "טובה" : "דורשת שיפור"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
