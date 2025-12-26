import { Bell, Search, Menu } from "lucide-react";

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
  showSearch?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export function TopBar({ title, onMenuClick, showSearch = true, notificationCount = 0, onNotificationClick }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 w-full border-b border-border bg-background-secondary/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Right Side - Title & Menu */}
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h1 className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {/* Left Side - Search & Notifications */}
        <div className="flex items-center gap-3">
          {showSearch && (
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-input-background border border-border hover:border-primary/50 transition-colors">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">חיפוש...</span>
            </button>
          )}
          
          <button 
            onClick={onNotificationClick}
            className="relative p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 left-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs bg-destructive text-destructive-foreground rounded-full animate-pulse">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}