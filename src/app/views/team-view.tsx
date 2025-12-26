import { TrendingUp, Award, Clock, Calendar } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: {
    shifts: number;
    nights: number;
    weekends: number;
    coverage: number;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "מיכל אברהם",
    role: "אחות אחראית",
    avatar: "מ",
    stats: { shifts: 18, nights: 4, weekends: 3, coverage: 95 },
  },
  {
    id: "2",
    name: "דני כהן",
    role: "אחות",
    avatar: "ד",
    stats: { shifts: 16, nights: 4, weekends: 3, coverage: 92 },
  },
  {
    id: "3",
    name: "שרה לוי",
    role: "אחות",
    avatar: "ש",
    stats: { shifts: 17, nights: 5, weekends: 4, coverage: 88 },
  },
  {
    id: "4",
    name: "יוסי אברהם",
    role: "אח",
    avatar: "י",
    stats: { shifts: 15, nights: 3, weekends: 2, coverage: 85 },
  },
  {
    id: "5",
    name: "רחל דוד",
    role: "אחות",
    avatar: "ר",
    stats: { shifts: 19, nights: 6, weekends: 5, coverage: 98 },
  },
];

export function TeamView() {
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
                <div className="text-2xl">85</div>
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
                <div className="text-2xl">92%</div>
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
                <div className="text-2xl">טוב</div>
              </div>
            </div>
          </div>
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
                  <th className="px-4 py-3">כיסוי</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`border-t border-border hover:bg-accent/30 transition-colors ${
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
        <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="mb-1">תובנות הוגנות</h4>
              <p className="text-sm text-muted-foreground">
                החלוקה הכללית איזונית. שימו לב: ליוסי אברהם יש פחות משמרות לילה וסופ״ש יחסית לאחרים.
                שקלו להציע לו משמרות נוספות לאיזון.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
