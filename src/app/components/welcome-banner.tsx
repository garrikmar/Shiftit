import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  userName: string;
  upcomingShifts: number;
}

export function WelcomeBanner({ userName, upcomingShifts }: WelcomeBannerProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent p-6 mb-6">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2>{getGreeting()}, {userName}</h2>
        </div>
        <p className="text-muted-foreground">
          יש לך {upcomingShifts} משמרות קרובות. בהצלחה!
        </p>
      </div>
      
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
    </div>
  );
}
