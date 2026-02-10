import { Shift } from "../components/shift-card";
import { FilterChips } from "../components/filter-chips";
import { useState, useMemo } from "react";
import { EmptyState } from "../components/empty-state";
import { Briefcase } from "lucide-react";
import { INITIAL_UNCOVERED_SHIFTS } from "../data/mock-data";
import { OpenShiftsGrid } from "../components/shifts/open-shifts-grid";

interface OpenShiftsViewProps {
  shifts: Shift[];
  onTakeShift: (shift: Shift) => void;
}

export function OpenShiftsView({ shifts: initialShifts, onTakeShift }: OpenShiftsViewProps) {
  const [filters, setFilters] = useState([
    { id: "all", label: "הכל", active: true },
    { id: "nurse", label: "אחות", active: false },
    { id: "morning", label: "בוקר", active: false },
    { id: "evening", label: "ערב", active: false },
    { id: "night", label: "לילה", active: false },
  ]);

  const openShifts = useMemo(() => {
    return INITIAL_UNCOVERED_SHIFTS.map(s => ({
        id: s.id,
        title: s.title,
        role: "אחות",
        date: s.date,
        startTime: s.time.split(" - ")[0],
        endTime: s.time.split(" - ")[1],
        location: "מחלקה פנימית א׳",
        status: "open" as const
    }));
  }, []);

  const toggleFilter = (id: string) => {
    if (id === "all") {
      setFilters(filters.map(f => ({ ...f, active: f.id === "all" })));
      return;
    }

    setFilters(prev => {
      const next = prev.map(f => {
        if (f.id === id) return { ...f, active: !f.active };
        if (f.id === "all") return { ...f, active: false };
        return f;
      });
      
      // If no filters are active, revert to "all"
      if (!next.some(f => f.active)) {
        return next.map(f => ({ ...f, active: f.id === "all" }));
      }
      return next;
    });
  };

  const filteredShifts = useMemo(() => {
    const activeFilters = filters.filter(f => f.active);
    // If "all" is active, return everything
    if (activeFilters.some(f => f.id === "all")) {
      return openShifts;
    }

    return openShifts.filter(shift => {
      // Check if shift matches ANY active filter
      return activeFilters.some(filter => {
        switch (filter.id) {
          case "nurse": return shift.role.includes("אחות");
          case "morning": return shift.title.includes("בוקר");
          case "evening": return shift.title.includes("ערב");
          case "night": return shift.title.includes("לילה");
          default: return false;
        }
      });
    });
  }, [openShifts, filters]);

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6 min-h-[400px]">
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2>משמרות פתוחות</h2>
            <span className="text-sm text-muted-foreground">
              {filteredShifts.length} משמרות זמינות
            </span>
          </div>
          <FilterChips filters={filters} onToggle={toggleFilter} />
        </div>

        {filteredShifts.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="אין משמרות פתוחות כרגע"
            description="נסו לשנות את הסינון או בדקו שוב מאוחר יותר."
          />
        ) : (
          <OpenShiftsGrid shifts={filteredShifts} onTakeShift={onTakeShift} />
        )}
      </div>
    </div>
  );
}
