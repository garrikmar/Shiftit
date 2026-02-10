import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ShiftType, labelMap, formatDateLocal, formatDateDisplay } from "./types";

interface ShiftMultiSelectProps {
  selectedTypes: ShiftType[];
  onChange: (types: ShiftType[]) => void;
  selectedDate: Date | undefined;
  savedShifts: Record<string, ShiftType[]>;
  onRemoveShift: (iso: string, type: ShiftType) => void;
}

export function ShiftMultiSelect({
  selectedTypes,
  onChange,
  selectedDate,
  savedShifts,
  onRemoveShift,
}: ShiftMultiSelectProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm text-muted-foreground">סוג משמרת</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="justify-between">
            {selectedTypes.length === 0
              ? "בחר/י סוג משמרת"
              : selectedTypes.length === 3
              ? "כל המשמרות"
              : selectedTypes.map((t) => labelMap[t]).join(", ")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuCheckboxItem
            checked={selectedTypes.length === 3}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange(["morning", "evening", "night"]);
              } else {
                onChange([]);
              }
            }}
          >
            הכל
          </DropdownMenuCheckboxItem>
          {Object.entries(labelMap).map(([key, label]) => {
             const type = key as ShiftType;
             return (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => {
                  onChange(
                    checked
                      ? [...selectedTypes, type]
                      : selectedTypes.filter((t) => t !== type)
                  );
                }}
              >
                {label}
              </DropdownMenuCheckboxItem>
             );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedDate && (
        <span className="text-xs text-muted-foreground">
          תאריך נבחר: {formatDateDisplay(selectedDate)}
        </span>
      )}

      {/* Chips for saved shifts on selected day */}
      {selectedDate && (
        (() => {
          const iso = formatDateLocal(selectedDate);
          const types = savedShifts[iso] ?? [];
          if (types.length === 0) return null;
          
          const chipMap: Record<ShiftType, string> = {
            morning: "border-emerald-500 text-emerald-400",
            evening: "border-amber-500 text-amber-400",
            night: "border-violet-500 text-violet-400",
          };

          return (
            <div className="flex flex-wrap gap-2 mt-1">
              {types.map((type) => (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${chipMap[type]} bg-transparent`}
                >
                  {labelMap[type]}
                  <button
                    type="button"
                    className="ml-1 opacity-70 hover:opacity-100"
                    aria-label={`הסר ${labelMap[type]}`}
                    onClick={() => onRemoveShift(iso, type)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
}
