import { useMemo, useState } from "react";
import { CalendarHeader } from "../components/calendar-header";
import { Shift, ShiftCard } from "../components/shift-card";
import { WelcomeBanner } from "../components/welcome-banner";
import { AlertCircle } from "lucide-react";
import { INITIAL_TEAM_MEMBERS, INITIAL_UNCOVERED_SHIFTS, generateAllShifts } from "../data/mock-data";

interface CalendarViewProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
  onCancelShift: (shift: Shift) => void;
  onViewOpenShifts: () => void;
}

export function CalendarView({ shifts: initialShifts, onShiftClick, onCancelShift, onViewOpenShifts }: CalendarViewProps) {
  // Month-only: show month by an anchor date; default to today
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const weekDays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

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
            {/* Month View (only) */}
            <div className="rounded-lg border border-card-border bg-card p-4">
              <div className="grid grid-cols-7 gap-px bg-card-border rounded-lg overflow-hidden border border-card-border">
                {weekDays.map((day, i) => (
                  <div key={i} className="bg-accent p-2 text-center text-sm font-medium">
                    {day}
                  </div>
                ))}
                {Array.from({ length: monthInfo.daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${day
                    .toString()
                    .padStart(2, "0")}/${(monthInfo.month + 1)
                    .toString()
                    .padStart(2, "0")}/${monthInfo.year}`;
                  const shift = synchronizedShifts.find((s) => s.date === dateStr);

                  return (
                    <div key={i} className="bg-card min-h-[100px] p-2 hover:bg-accent/50 transition-colors">
                      <div
                        className={`text-sm mb-1 ${
                          shift
                            ? `w-6 h-6 rounded-full flex items-center justify-center ${
                                shift.title.includes("לילה")
                                  ? "bg-purple-500 text-white"
                                  : shift.title.includes("ערב")
                                  ? "bg-orange-500 text-white"
                                  : "bg-primary text-primary-foreground"
                              }`
                            : ""
                        }`}
                      >
                        {day}
                      </div>
                      {shift && (
                        <div
                          onClick={() => onShiftClick(shift)}
                          className={`p-1 rounded border-r-2 cursor-pointer transition-colors mb-1 ${
                            shift.title.includes("לילה")
                              ? "bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20"
                              : shift.title.includes("ערב")
                              ? "bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20"
                              : "bg-primary/10 border-primary text-primary hover:bg-primary/20"
                          }`}
                        >
                          <div className="text-[10px] font-medium truncate">{shift.title}</div>
                          <div
                            className={`text-[10px] truncate ${
                              shift.title.includes("לילה") || shift.title.includes("ערב")
                                ? "opacity-90"
                                : "text-muted-foreground"
                            }`}
                            dir="ltr"
                          >
                            {shift.startTime}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <h3>בקשות ממתינות</h3>
                </div>
                <div className="space-y-3">
                  {pendingRequests.map((shift) => (
                    <ShiftCard key={shift.id} shift={shift} onClick={() => onShiftClick(shift)} compact />
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Open Shifts */}
            <div className="rounded-lg border border-card-border bg-card p-4">
              <h3 className="mb-4">משמרות פתוחות מומלצות</h3>
              <div className="space-y-3">
                {openShifts.map((shift) => (
                  <ShiftCard key={shift.id} shift={shift} onClick={() => onShiftClick(shift)} compact />
                ))}
              </div>
              <button
                onClick={onViewOpenShifts}
                className="w-full mt-4 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
              >
                צפייה בכל המשמרות הפתוחות
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}