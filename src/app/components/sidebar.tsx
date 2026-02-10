import { Calendar, Users, Briefcase, FileText, Settings, Home, Bell, X, Plus } from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isManager?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ activeView, onViewChange, isManager, isOpen = false, onToggle }: SidebarProps) {
  const employeeMenuItems = [
    { id: "calendar", label: "המשמרות שלי", icon: Calendar },
    { id: "add-shift", label: "מילוי משמרות", icon: Plus },
    { id: "open-shifts", label: "משמרות פתוחות", icon: Briefcase },
    { id: "requests", label: "בקשות שלי", icon: FileText },
    { id: "notifications", label: "התראות", icon: Bell },
  ];

  const managerMenuItems = [
    { id: "calendar", label: "המשמרות שלי", icon: Calendar },
    { id: "team", label: "ניהול צוות", icon: Users },
    { id: "add-shift", label: "מילוי משמרות", icon: Plus },
    { id: "pending", label: "בקשות ממתינות", icon: FileText },
    { id: "open-shifts", label: "משמרות פתוחות", icon: Briefcase },
    { id: "notifications", label: "התראות", icon: Bell },
  ];

  const menuItems = isManager ? managerMenuItems : employeeMenuItems;
  
  const handleItemClick = (id: string) => {
    onViewChange(id);
    // Close sidebar on mobile after selection
    if (onToggle && isOpen) {
      onToggle();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:relative
        right-0 top-0 bottom-0
        z-50 lg:z-auto
        w-64
        border-l border-sidebar-border bg-sidebar
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        lg:flex flex-col
        ${isOpen ? 'flex' : 'hidden lg:flex'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
              ShiftIT
            </span>
          </div>
          
          {/* Close Button - Mobile Only */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-all duration-200 active:scale-95"
            aria-label="סגור תפריט"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
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
            onClick={() => handleItemClick("settings")}
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
    </>
  );
}