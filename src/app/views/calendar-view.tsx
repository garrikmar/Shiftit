import {useState, useMemo} from "react";
import {CalendarHeader} from "../components/calendar-header";
import {Shift, ShiftCard} from "../components/shift-card";
import {WelcomeBanner} from "../components/welcome-banner";
import {AlertCircle, Clock} from "lucide-react";
import { INITIAL_TEAM_MEMBERS, INITIAL_UNCOVERED_SHIFTS, generateAllShifts, WEEKENDS } from "../data/mock-data";

interface CalendarViewProps {
    shifts: Shift[]; // Keeping for backward compatibility if needed, but we'll use generated shifts
    onShiftClick: (shift: Shift) => void;
    onCancelShift: (shift: Shift) => void;
}

export function CalendarView({shifts: initialShifts, onShiftClick, onCancelShift}: CalendarViewProps) {
    const [view, setView] = useState<"day" | "week" | "month">("week");
    const [currentWeek, setCurrentWeek] = useState(0);

    const weekDays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
    const currentMonth = "ינואר 2026";

    // Generate synchronized shifts
    const allScheduledShifts = useMemo(() => {
        return generateAllShifts(INITIAL_TEAM_MEMBERS, INITIAL_UNCOVERED_SHIFTS);
    }, []);

    // Convert allScheduledShifts to Shift[] type
    const synchronizedShifts = useMemo(() => {
        const myName = "מיכל אברהם";
        return allScheduledShifts
            .filter(s => s.memberName === myName)
            .map((s, idx) => ({
                id: `sync-${idx}`,
                title: s.title,
                role: "אחות אחראית",
                date: `${s.day.toString().padStart(2, '0')}/01/2026`,
                startTime: s.time.split(" - ")[0],
                endTime: s.time.split(" - ")[1],
                location: "מחלקה פנימית א׳",
                status: "scheduled" as const
            }));
    }, [allScheduledShifts]);

    const myUpcomingShifts = synchronizedShifts.slice(0, 3);
    const pendingRequests = []; // Mocked as empty for now to match team view sync
    const openShifts = INITIAL_UNCOVERED_SHIFTS.map(s => ({
        id: s.id,
        title: s.title,
        role: "אחות",
        date: s.date,
        startTime: s.time.split(" - ")[0],
        endTime: s.time.split(" - ")[1],
        location: "מחלקה פנימית א׳",
        status: "open" as const
    }));

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
                <WelcomeBanner userName="מיכל" upcomingShifts={myUpcomingShifts.length}/>

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
                        {view === "week" && (
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
                                            <div className="w-16 text-sm text-muted-foreground pt-2" dir="ltr">{time}</div>
                                            <div className="flex-1 grid grid-cols-7 gap-2">
                                                {weekDays.map((_, dayIndex) => {
                                                    // Jan 2026 starts on Thursday (index 4 in 0-indexed Sun-Sat)
                                                    // Day 1 = Thursday (dayIndex 4)
                                                    // For a generic week view in the middle of Jan:
                                                    // Let's assume dayIndex 0 is Sunday Jan 18
                                                    const day = 18 + dayIndex;
                                                    const shift = synchronizedShifts.find(s =>
                                                        s.startTime.startsWith(time.split(":")[0]) &&
                                                        s.date === `${day.toString().padStart(2, '0')}/01/2026`
                                                    );

                                                    return (
                                                        <div key={dayIndex}
                                                             className="min-h-[60px] rounded-md border border-border/50">
                                                            {shift && (
                                                                <div
                                                                    onClick={() => onShiftClick(shift)}
                                                                    className="h-full p-2 rounded-md bg-primary/10 border-r-2 border-primary cursor-pointer hover:bg-primary/20 transition-colors"
                                                                >
                                                                    <div className="text-xs truncate">{shift.title}</div>
                                                                    <div
                                                                        className="text-xs text-muted-foreground truncate">{shift.role}</div>
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
                        )}

                        {/* Month View */}
                        {view === "month" && (
                            <div className="rounded-lg border border-card-border bg-card p-4">
                                <div className="grid grid-cols-7 gap-px bg-card-border rounded-lg overflow-hidden border border-card-border">
                                    {weekDays.map((day, i) => (
                                        <div key={i} className="bg-accent p-2 text-center text-sm font-medium">
                                            {day}
                                        </div>
                                    ))}
                                    {Array.from({length: 31}).map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${day.toString().padStart(2, '0')}/01/2026`;
                                        const shift = synchronizedShifts.find(s => s.date === dateStr);

                                        return (
                                            <div key={i} className="bg-card min-h-[100px] p-2 hover:bg-accent/50 transition-colors">
                                                <div className={`text-sm mb-1 ${shift ? "w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center" : ""}`}>
                                                    {day}
                                                </div>
                                                {shift && (
                                                    <div
                                                        onClick={() => onShiftClick(shift)}
                                                        className="p-1 rounded bg-primary/10 border-r-2 border-primary cursor-pointer hover:bg-primary/20 transition-colors mb-1"
                                                    >
                                                        <div className="text-[10px] font-medium truncate">{shift.title}</div>
                                                        <div className="text-[10px] text-muted-foreground truncate" dir="ltr">{shift.startTime}</div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Day View Placeholder */}
                        {view === "day" && (
                            <div className="rounded-lg border border-card-border bg-card p-8 text-center text-muted-foreground">
                                תצוגת יום בבנייה...
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* My Upcoming Shifts */}
                        <div className="rounded-lg border border-card-border bg-card p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-primary"/>
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
                                    <AlertCircle className="w-5 h-5 text-warning"/>
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
                            <button
                                className="w-full mt-4 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">
                                צפייה בכל המשמרות הפתוחות
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}