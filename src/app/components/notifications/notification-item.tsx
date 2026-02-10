import { Bell, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case "error":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "info":
        return <Bell className="w-5 h-5 text-secondary" />;
    }
  };

  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-primary/10 border-primary/30";
      case "error":
        return "bg-destructive/10 border-destructive/30";
      case "warning":
        return "bg-warning/10 border-warning/30";
      case "info":
        return "bg-secondary/10 border-secondary/30";
    }
  };

  return (
    <div
      className={`
        rounded-lg border p-4 transition-all cursor-pointer
        ${notification.read
          ? "border-border bg-card opacity-60 hover:opacity-100"
          : "border-card-border bg-card hover:border-primary/50"
        }
      `}
    >
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={notification.read ? "" : ""}>{notification.title}</h4>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{notification.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
