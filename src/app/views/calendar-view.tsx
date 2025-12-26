import { useState } from "react";
import { CalendarHeader } from "../components/calendar-header";
import { ShiftCard, Shift } from "../components/shift-card";
import { WelcomeBanner } from "../components/welcome-banner";
import { Clock, AlertCircle } from "lucide-react";

interface CalendarViewProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
  onCancelShift: (shift: Shift) => void;
}

export function CalendarView({ shifts, onShiftClick, onCancelShift }: CalendarViewProps) {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [currentWeek, setCurrentWeek] = useState(0);

  const weekDays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const currentMonth = "דצמבר 2025";

  const myUpcomingShifts = shifts.filter(s => s.status === "scheduled").slice(0, 3);
  const pendingRequests = shifts.filter(s => s.status === "pending");
  const openShifts = shifts.filter(s => s.status === "open").slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <WelcomeBanner userName="מיכל" upcomingShifts={myUpcomingShifts.length} />
        
        <CalendarHeader
          currentMonth={currentMonth}
          onPrevious={() => setCurrentWeek(currentWeek - 1)}
          onNext={() => setCurrentWeek(currentWeek + 1)}
          onToday={() => setCurrentWeek(0)}
          view={view}
          onViewChange={setView}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Week View */}
            <div className="rounded-lg border border-card-border bg-card p-4">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day, i) => (
                  <div key={i} className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">{day}</div>
                    <div className={`
                      w-full aspect-square rounded-lg flex items-center justify-center
                      ${i === 2 ? "bg-primary text-primary-foreground" : "bg-accent"}
                    `}>
                      {22 + i}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2 mt-6">
                {["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"].map((time, i) => (
                  <div key={time} className="flex gap-2">
                    <div className="w-16 text-sm text-muted-foreground pt-2">{time}</div>
                    <div className="flex-1 grid grid-cols-7 gap-2">
                      {weekDays.map((_, dayIndex) => {
                        const shift = shifts.find(s => 
                          s.startTime.startsWith(time.split(":")[0]) && 
                          (dayIndex === 2 || dayIndex === 4)
                        );
                        
                        return (
                          <div key={dayIndex} className="min-h-[60px] rounded-md border border-border/50">
                            {shift && (
                              <div
                                onClick={() => onShiftClick(shift)}
                                className="h-full p-2 rounded-md bg-primary/10 border-r-2 border-primary cursor-pointer hover:bg-primary/20 transition-colors"
                              >
                                <div className="text-xs truncate">{shift.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{shift.role}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* My Upcoming Shifts */}
            <div className="rounded-lg border border-card-border bg-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3>המשמרות הקרובות שלי</h3>
              </div>
              <div className="space-y-3">
                {myUpcomingShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    onClick={() => onShiftClick(shift)}
                    compact
                    showActions
                    onCancel={() => onCancelShift(shift)}
                  />
                ))}
              </div>
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <h3>בקשות ממתינות</h3>
                </div>
                <div className="space-y-3">
                  {pendingRequests.map((shift) => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onClick={() => onShiftClick(shift)}
                      compact
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Open Shifts */}
            <div className="rounded-lg border border-card-border bg-card p-4">
              <h3 className="mb-4">משמרות פתוחות מומלצות</h3>
              <div className="space-y-3">
                {openShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    onClick={() => onShiftClick(shift)}
                    compact
                  />
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                צפייה בכל המשמרות הפתוחות
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}