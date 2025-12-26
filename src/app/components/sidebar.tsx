import { Calendar, Users, Briefcase, FileText, Settings, Home, Bell } from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isManager?: boolean;
}

export function Sidebar({ activeView, onViewChange, isManager }: SidebarProps) {
  const employeeMenuItems = [
    { id: "calendar", label: "לוח שנה", icon: Calendar },
    { id: "my-shifts", label: "המשמרות שלי", icon: Home },
    { id: "open-shifts", label: "משמרות פתוחות", icon: Briefcase },
    { id: "requests", label: "בקשות שלי", icon: FileText },
    { id: "notifications", label: "התראות", icon: Bell },
  ];

  const managerMenuItems = [
    { id: "calendar", label: "לוח שנה", icon: Calendar },
    { id: "my-shifts", label: "המשמרות שלי", icon: Home },
    { id: "team", label: "ניהול צוות", icon: Users },
    { id: "pending", label: "בקשות ממתינות", icon: FileText },
    { id: "open-shifts", label: "משמרות פתוחות", icon: Briefcase },
    { id: "notifications", label: "התראות", icon: Bell },
  ];

  const menuItems = isManager ? managerMenuItems : employeeMenuItems;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-l border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-semibold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
          ShiftIT
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary-glow" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-sidebar-border">
        <button 
          onClick={() => onViewChange("settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeView === "settings"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary-glow"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>הגדרות</span>
        </button>
      </div>
    </aside>
  );
}