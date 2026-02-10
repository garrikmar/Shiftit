import { NOTIFICATIONS } from "../data/mock-notifications";
import { NotificationItem } from "../components/notifications/notification-item";

export function NotificationsView() {
  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        <h2 className="mb-6">התראות</h2>
        <div className="space-y-4">
          {NOTIFICATIONS.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
}
