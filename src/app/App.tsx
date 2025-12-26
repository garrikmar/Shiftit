import { useState } from "react";
import { ThemeProvider } from "./contexts/theme-context";
import { TopBar } from "./components/top-bar";
import { Sidebar } from "./components/sidebar";
import { BottomNav } from "./components/bottom-nav";
import { CalendarView } from "./views/calendar-view";
import { MyShiftsView } from "./views/my-shifts-view";
import { OpenShiftsView } from "./views/open-shifts-view";
import { RequestsView } from "./views/requests-view";
import { ManagerPendingView } from "./views/manager-pending-view";
import { TeamView } from "./views/team-view";
import { NotificationsView } from "./views/notifications-view";
import { SettingsView } from "./views/settings-view";
import { SwapRequestModal } from "./modals/swap-request-modal";
import { ManagerRequestDetailModal } from "./modals/manager-request-detail-modal";
import { ShiftDetailModal } from "./modals/shift-detail-modal";
import { Shift } from "./components/shift-card";
import { toast } from "sonner";
import { ThemedToaster } from "./components/themed-toaster";

// Sample data
const sampleShifts: Shift[] = [
  {
    id: "1",
    title: "משמרת בוקר",
    role: "אחות",
    date: "יום רביעי, 24 דצמבר",
    startTime: "06:00",
    endTime: "14:00",
    location: "מחלקה א׳",
    status: "scheduled",
  },
  {
    id: "2",
    title: "משמרת ערב",
    role: "אחות אחראית",
    date: "יום חמישי, 25 דצמבר",
    startTime: "14:00",
    endTime: "22:00",
    location: "מחלקה ב׳",
    status: "scheduled",
  },
  {
    id: "3",
    title: "משמרת לילה",
    role: "אח",
    date: "יום שישי, 26 דצמבר",
    startTime: "22:00",
    endTime: "06:00",
    location: "מחלקה א׳",
    status: "pending",
    requester: "דני כהן",
    replacement: "שרה לוי",
  },
  {
    id: "4",
    title: "משמרת בוקר",
    role: "אחות",
    date: "יום שבת, 27 דצמבר",
    startTime: "06:00",
    endTime: "14:00",
    location: "מחלקה ג׳",
    status: "scheduled",
  },
  {
    id: "5",
    title: "משמרת ערב",
    role: "אחות",
    date: "יום ראשון, 28 דצמבר",
    startTime: "14:00",
    endTime: "22:00",
    location: "מחלקה א׳",
    status: "open",
  },
  {
    id: "6",
    title: "משמרת בוקר",
    role: "אחות אחראית",
    date: "יום שני, 29 דצמבר",
    startTime: "06:00",
    endTime: "14:00",
    location: "מחלקה ב׳",
    status: "open",
  },
  {
    id: "7",
    title: "משמרת לילה",
    role: "אח",
    date: "יום שלישי, 30 דצמבר",
    startTime: "22:00",
    endTime: "06:00",
    location: "מחלקה א׳",
    status: "pending",
    requester: "מיכל אברהם",
  },
  {
    id: "8",
    title: "משמרת ערב",
    role: "אחות",
    date: "יום רביעי, 31 דצמבר",
    startTime: "14:00",
    endTime: "22:00",
    location: "מחלקה ג׳",
    status: "scheduled",
  },
  {
    id: "9",
    title: "משמרת בוקר",
    role: "אחות",
    date: "יום חמישי, 1 ינואר",
    startTime: "06:00",
    endTime: "14:00",
    location: "מחלקה א׳",
    status: "approved",
    requester: "יוסי אברהם",
    replacement: "דני כהן",
  },
  {
    id: "10",
    title: "משמרת לילה",
    role: "אח",
    date: "יום שישי, 2 ינואר",
    startTime: "22:00",
    endTime: "06:00",
    location: "מחלקה ב׳",
    status: "open",
  },
];

export default function App() {
  const [activeView, setActiveView] = useState("calendar");
  const [isManager] = useState(true); // Toggle this to see employee/manager views
  const [shifts] = useState<Shift[]>(sampleShifts);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showShiftDetailModal, setShowShiftDetailModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    if (isManager && shift.status === "pending" && shift.requester) {
      setShowManagerModal(true);
    } else {
      setShowShiftDetailModal(true);
    }
  };

  const handleCancelShift = (shift: Shift) => {
    setSelectedShift(shift);
    setShowSwapModal(true);
  };

  const handleSwapSubmit = (data: { type: "group" | "specific"; reason: string; targetUser?: string }) => {
    console.log("Swap request:", data);
    toast.success("הבקשה נשלחה בהצלחה!");
    setTimeout(() => {
      setShowSwapModal(false);
      setSelectedShift(null);
    }, 2000);
  };

  const handleApprove = () => {
    toast.success("הבקשה אושרה בהצלחה!");
    setShowManagerModal(false);
    setSelectedShift(null);
  };

  const handleReject = () => {
    toast.error("הבקשה נדחתה");
    setShowManagerModal(false);
    setSelectedShift(null);
  };

  const handleTakeShift = (shift: Shift) => {
    toast.success(`המשמרת "${shift.title}" נשלחה לאישור מנהל`);
  };

  const renderView = () => {
    switch (activeView) {
      case "calendar":
        return (
          <CalendarView
            shifts={shifts}
            onShiftClick={handleShiftClick}
            onCancelShift={handleCancelShift}
          />
        );
      case "my-shifts":
        return (
          <MyShiftsView
            shifts={shifts}
            onShiftClick={handleShiftClick}
            onCancelShift={handleCancelShift}
          />
        );
      case "open-shifts":
        return (
          <OpenShiftsView
            shifts={shifts}
            onTakeShift={handleTakeShift}
          />
        );
      case "requests":
        return (
          <RequestsView
            shifts={shifts}
            onRequestClick={handleShiftClick}
          />
        );
      case "pending":
        return (
          <ManagerPendingView
            shifts={shifts}
            onRequestClick={handleShiftClick}
          />
        );
      case "team":
        return <TeamView />;
      case "notifications":
        return <NotificationsView />;
      case "settings":
        return <SettingsView />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="mb-2">בקרוב...</h2>
              <p className="text-muted-foreground">תכונה זו תהיה זמינה בקרוב</p>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemedToaster />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeView={activeView}
            onViewChange={setActiveView}
            isManager={isManager}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar
              title="ShiftIT"
              notificationCount={3}
              onNotificationClick={() => setActiveView("notifications")}
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />

            {renderView()}
          </div>
        </div>

        <BottomNav
          activeView={activeView}
          onViewChange={setActiveView}
          isManager={isManager}
        />

        {/* Modals */}
        {showSwapModal && selectedShift && (
          <SwapRequestModal
            shift={selectedShift}
            onClose={() => {
              setShowSwapModal(false);
              setSelectedShift(null);
            }}
            onSubmit={handleSwapSubmit}
          />
        )}

        {showManagerModal && selectedShift && (
          <ManagerRequestDetailModal
            shift={selectedShift}
            onClose={() => {
              setShowManagerModal(false);
              setSelectedShift(null);
            }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {showShiftDetailModal && selectedShift && (
          <ShiftDetailModal
            shift={selectedShift}
            onClose={() => {
              setShowShiftDetailModal(false);
              setSelectedShift(null);
            }}
            onCancel={() => {
              setShowShiftDetailModal(false);
              handleCancelShift(selectedShift);
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
}