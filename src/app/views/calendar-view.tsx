import { useMemo, useState } from "react";
import { CalendarHeader } from "../components/calendar-header";
import { Shift } from "../components/shift-card";
import { WelcomeBanner } from "../components/welcome-banner";
import { INITIAL_TEAM_MEMBERS, INITIAL_UNCOVERED_SHIFTS, generateAllShifts } from "../data/mock-data";
import { MonthView } from "../components/calendar/month-view";
import { CalendarSidebar } from "../components/calendar/calendar-sidebar";

interface CalendarViewProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
  onCancelShift: (shift: Shift) => void;
  onViewOpenShifts: () => void;
}

export function CalendarView({ shifts: initialShifts, onShiftClick, onCancelShift, onViewOpenShifts }: CalendarViewProps) {
  // Month-only: show month by an anchor date; default to today
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const currentMonth = useMemo(() => {
    const months = [
      "ינואר",
      "פברואר",
      "מרץ",
      "אפריל",
      "מאי",
      "יוני",
      "יולי",
      "אוגוסט",
      "ספטמבר",
      "אוקטובר",
      "נובמבר",
      "דצמבר",
    ];
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [currentDate]);

  const monthInfo = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, first, daysInMonth };
  }, [currentDate]);

  // Generate shifts (mock) and map to DD/MM/YYYY for the current month
  const allScheduledShifts = useMemo(() => {
    return generateAllShifts(INITIAL_TEAM_MEMBERS, INITIAL_UNCOVERED_SHIFTS);
  }, []);

  const synchronizedShifts = useMemo(() => {
    const myName = "מיכל אברהם";
    const month = monthInfo.month + 1;
    const year = monthInfo.year;
    return allScheduledShifts
      .filter((s) => s.memberName === myName)
      .map((s, idx) => ({
        id: `sync-${idx}`,
        title: s.title,
        role: "אחות אחראית",
        date: `${s.day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
        startTime: s.time.split(" - ")[0],
        endTime: s.time.split(" - ")[1],
        location: "מחלקה פנימית א׳",
        status: "scheduled" as const,
      }));
  }, [allScheduledShifts, monthInfo.month, monthInfo.year]);

  const myUpcomingShifts = synchronizedShifts.slice(0, 5);
  const pendingRequests: Shift[] = [];
  const openShifts = useMemo(() => {
    return INITIAL_UNCOVERED_SHIFTS
      .filter((s) => {
        const [day, month, year] = s.date.split("/").map(Number);
        return month === monthInfo.month + 1 && year === monthInfo.year;
      })
      .map((s) => ({
        id: s.id,
        title: s.title,
        role: "אחות",
        date: s.date,
        startTime: s.time.split(" - ")[0],
        endTime: s.time.split(" - ")[1],
        location: "מחלקה פנימית א׳",
        status: "open" as const,
      }));
  }, [monthInfo]);

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <WelcomeBanner userName="מיכל" upcomingShifts={myUpcomingShifts.length} />

        <CalendarHeader
          currentMonth={currentMonth}
          onPrevious={() => {
            const d = new Date(currentDate);
            d.setMonth(d.getMonth() - 1);
            setCurrentDate(d);
          }}
          onNext={() => {
            const d = new Date(currentDate);
            d.setMonth(d.getMonth() + 1);
            setCurrentDate(d);
          }}
          onToday={() => setCurrentDate(new Date())}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar Area */}
          <div className="lg:col-span-2 space-y-4">
            <MonthView 
              monthInfo={monthInfo} 
              shifts={synchronizedShifts} 
              onShiftClick={onShiftClick} 
            />
          </div>

          {/* Sidebar */}
          <CalendarSidebar 
            pendingRequests={pendingRequests} 
            openShifts={openShifts} 
            onShiftClick={onShiftClick} 
            onViewOpenShifts={onViewOpenShifts} 
          />
        </div>
      </div>
    </div>
  );
}