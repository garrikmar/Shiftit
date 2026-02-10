import { Notification } from "../components/notifications/notification-item";

export const NOTIFICATIONS: Notification[] = [
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
