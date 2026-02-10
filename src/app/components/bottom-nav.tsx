import { Calendar, Home, Briefcase, FileText, Users, Plus } from "lucide-react";

interface BottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isManager?: boolean;
}

export function BottomNav({ activeView, onViewChange, isManager }: BottomNavProps) {
  const employeeMenuItems = [
    { id: "calendar", label: "לוח", icon: Calendar },
    { id: "my-shifts", label: "המשמרות", icon: Home },
    { id: "open-shifts", label: "פתוחות", icon: Briefcase },
    { id: "requests", label: "בקשות", icon: FileText },
    { id: "add-shift", label: "הוספה", icon: Plus },
  ];

  const managerMenuItems = [
    { id: "calendar", label: "לוח", icon: Calendar },
    { id: "my-shifts", label: "שלי", icon: Home },
    { id: "pending", label: "ממתינות", icon: FileText },
    { id: "team", label: "צוות", icon: Users },
    { id: "add-shift", label: "הוספה", icon: Plus },
  ];

  const menuItems = isManager ? managerMenuItems : employeeMenuItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background-secondary/95 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[70px]
                ${isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_var(--primary-glow)]" : ""}`} />
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}