import { Bell, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "בקשה אושרה",
    message: "הבקשה שלך להחלפת משמרת ב-28 דצמבר אושרה על ידי מיכל אברהם",
    time: "לפני 10 דקות",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "משמרת חדשה זמינה",
    message: "משמרת בוקר ב-30 דצמבר זמינה לקבלה. לחץ/י לפרטים נוספים.",
    time: "לפני שעה",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "תזכורת משמרת",
    message: "יש לך משמרת בוקר מחר ב-06:00. אל תשכח/י!",
    time: "לפני 3 שעות",
    read: false,
  },
  {
    id: "4",
    type: "success",
    title: "החלפה הושלמה",
    message: "דני כהן קיבל את המשמרת שלך ב-26 דצמבר",
    time: "אתמול",
    read: true,
  },
  {
    id: "5",
    type: "error",
    title: "בקשה נדחתה",
    message: "הבקשה להחלפת משמרת ב-25 דצמבר נדחתה - כיסוי לא מספיק",
    time: "לפני יומיים",
    read: true,
  },
];

export function NotificationsView() {
  const unreadCount = notifications.filter((n) => !n.read).length;

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
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2>התראות</h2>
          {unreadCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
              {unreadCount} חדשות
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
            סמן/י הכל כנקרא
          </button>
        )}

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
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
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">אין התראות חדשות</h3>
            <p className="text-muted-foreground">
              כל ההתראות שלך יופיעו כאן
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
