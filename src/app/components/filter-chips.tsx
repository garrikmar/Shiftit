import { X } from "lucide-react";

interface Filter {
  id: string;
  label: string;
  active: boolean;
}

interface FilterChipsProps {
  filters: Filter[];
  onToggle: (id: string) => void;
}

export function FilterChips({ filters, onToggle }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onToggle(filter.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full border transition-all
            ${filter.active
              ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary-glow/30"
              : "bg-card border-border text-foreground hover:border-primary/50"
            }
          `}
        >
          <span className="text-sm">{filter.label}</span>
          {filter.active && <X className="w-3 h-3" />}
        </button>
      ))}
    </div>
  );
}
