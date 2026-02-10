import { Info, AlertCircle } from "lucide-react";
import { TeamMember, UncoveredShift } from "../../data/mock-data";

interface FairnessInsightsProps {
  totalShifts: number;
  scheduledShiftsCount: number;
  uncoveredShifts: UncoveredShift[];
  teamMembersWithFairness: TeamMember[];
}

export function FairnessInsights({ totalShifts, scheduledShiftsCount, uncoveredShifts, teamMembersWithFairness }: FairnessInsightsProps) {
  const avgFairness = Math.round(teamMembersWithFairness.reduce((acc, m) => acc + m.stats.fairness, 0) / teamMembersWithFairness.length);
  const coveragePercent = Math.round((scheduledShiftsCount / totalShifts) * 100);

  return (
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
                  רמת הכיסוי הנוכחית היא {coveragePercent}%. קיימות {uncoveredShifts.length} משמרות ללא כיסוי שדורשות התייחסות מיידית.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs font-bold text-muted-foreground uppercase">הוגנות וחלוקה</div>
                <p className="text-sm text-foreground">
                  ציון ההוגנות הממוצע הוא {avgFairness}%. חלוקת הלילות והסופ״שים מתבצעת באופן שקוף ודינמי לכל חברי הצוות.
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
                ישנן {uncoveredShifts.length} משמרות פתוחות במרץ 2026. מומלץ לשבץ את אנשי הצוות עם רמת הכיסוי הנמוכה ביותר או אלו עם ציון הוגנות גבוה לאיזון העומס.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
