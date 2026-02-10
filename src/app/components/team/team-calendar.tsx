import { Calendar, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { TeamMember, UncoveredShift, generateAllShifts } from "../../data/mock-data";

interface TeamCalendarProps {
  months: { name: string; month: number; year: number }[];
  teamMembers: TeamMember[];
  uncoveredShifts: UncoveredShift[];
  onSelectUncoveredShift: (shift: UncoveredShift) => void;
  openMonth?: string;
  onOpenMonthChange?: (openMonth: string) => void;
}

export function TeamCalendar({ months, teamMembers, uncoveredShifts, onSelectUncoveredShift, openMonth, onOpenMonthChange }: TeamCalendarProps) {
  return (
    <div className="mb-6 rounded-lg border border-card-border bg-card overflow-hidden">
      <Accordion 
        type="single" 
        collapsible
        value={openMonth} 
        defaultValue={openMonth ? undefined : "month-2"} 
        onValueChange={onOpenMonthChange}
        className="w-full"
      >
        {months.map((m, idx) => {
          const monthShifts = generateAllShifts(teamMembers, uncoveredShifts, m.month, m.year);
          const daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
          const startDay = new Date(m.year, m.month, 1).getDay();

          return (
            <AccordionItem value={`month-${idx}`} key={idx} className="border-b last:border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:bg-accent/30 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3>לוח איוש חודשי - {m.name}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 pb-2 flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span>בוקר</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span>ערב</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span>לילה</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span>ללא כיסוי</span>
                    </div>
                </div>

                <div className="p-4 overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-7 gap-px bg-card-border border border-card-border rounded-lg overflow-hidden">
                      {["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"].map((day, i) => (
                        <div key={i} className="bg-accent p-2 text-center text-sm font-medium">
                          {day}
                        </div>
                      ))}
                      
                      {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-card/50 min-h-[120px]" />
                      ))}
                      
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${day.toString().padStart(2, '0')}/${(m.month + 1).toString().padStart(2, '0')}/${m.year}`;
                        const dayShifts = monthShifts.filter(s => s.day === day);
                        const dayUncovered = uncoveredShifts.filter(s => s.date === dateStr);

                        return (
                          <div key={i} className="bg-card min-h-[120px] p-2 border-t border-r border-card-border first:border-r-0 hover:bg-accent/10 transition-colors">
                            <div className="text-xs mb-2 text-muted-foreground font-medium flex justify-between">
                              <span>{day}</span>
                              {dayUncovered.length > 0 && (
                                <span className="text-[10px] text-destructive font-bold animate-pulse">חסר איוש</span>
                              )}
                            </div>
                            <div className="space-y-2">
                              {["morning", "evening", "night"].map(type => {
                                const shiftsOfType = dayShifts.filter(s => s.type === type);
                                const uncoveredOfType = dayUncovered.filter(s => 
                                  (type === 'morning' && s.title.includes('בוקר')) || 
                                  (type === 'evening' && s.title.includes('ערב')) || 
                                  (type === 'night' && s.title.includes('לילה'))
                                );
                                
                                const missingOfType = uncoveredOfType.length;
                                
                                if (shiftsOfType.length === 0 && missingOfType === 0) return null;

                                return (
                                  <div 
                                    key={type} 
                                    onClick={() => {
                                      if (missingOfType > 0) {
                                        onSelectUncoveredShift(uncoveredOfType[0]);
                                      }
                                    }}
                                    className={`
                                    p-1 rounded text-[9px] border-r-2 transition-colors
                                    ${type === 'night' 
                                      ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300' 
                                      : type === 'evening'
                                      ? 'bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-300'
                                      : 'bg-primary/10 border-primary text-primary'}
                                    ${missingOfType > 0 ? 'cursor-pointer hover:ring-1 hover:ring-destructive hover:bg-destructive/10' : ''}
                                  `}>
                                    <div className="font-bold flex justify-between">
                                      <span>{type === 'morning' ? 'בוקר' : type === 'evening' ? 'ערב' : 'לילה'}</span>
                                      {missingOfType > 0 && <span className="text-destructive animate-pulse">חסר ({missingOfType})</span>}
                                    </div>
                                    <div className="opacity-80">
                                      {shiftsOfType.map(s => s.memberName).join(', ')}
                                      {missingOfType > 0 && (shiftsOfType.length > 0 ? ', ' : '') + 'חסר איוש'}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      
                      {Array.from({ length: (7 - (daysInMonth + startDay) % 7) % 7 }).map((_, i) => (
                        <div key={`empty-end-${i}`} className="bg-card/50 min-h-[120px]" />
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <div className="p-3 bg-accent/30 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
        <Info className="w-4 h-4" />
        <span>הלוח מציג את כל שיבוצי הצוות ומשמרות פתוחות. לחצו על משמרת חסרה כדי לשבץ איש צוות.</span>
      </div>
    </div>
  );
}
