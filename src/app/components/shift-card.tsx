import { Clock, MapPin, User } from "lucide-react";

export type ShiftStatus = "scheduled" | "pending" | "approved" | "rejected" | "open";

export interface Shift {
  id: string;
  title: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: ShiftStatus;
  requester?: string;
  replacement?: string;
}

interface ShiftCardProps {
  shift: Shift;
  onClick?: () => void;
  compact?: boolean;
  showActions?: boolean;
  onCancel?: () => void;
  onTake?: () => void;
  takeLabel?: string;
}

const statusConfig: Record<ShiftStatus, { label: string; className: string }> = {
  scheduled: { label: "מתוכנן", className: "bg-secondary/20 text-secondary border-secondary/30" },
  pending: { label: "ממתין לאישור", className: "bg-warning/20 text-warning border-warning/30" },
  approved: { label: "אושר", className: "bg-primary/20 text-primary border-primary/30" },
  rejected: { label: "נדחה", className: "bg-destructive/20 text-destructive border-destructive/30" },
  open: { label: "פתוח", className: "bg-primary/20 text-primary border-primary/30" },
};

export function ShiftCard({ shift, onClick, compact, showActions, onCancel, onTake, takeLabel }: ShiftCardProps) {
  const statusStyle = statusConfig[shift.status];

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg border border-card-border bg-card backdrop-blur-sm
        transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary-glow/10
        ${onClick ? "cursor-pointer" : ""}
        ${compact ? "p-3" : "p-4"}
      `}
    >
      {/* Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="mb-1">{shift.title}</h3>
          <p className="text-sm text-muted-foreground">{shift.role}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs border ${statusStyle.className}`}>
          {statusStyle.label}
        </span>
      </div>

      {/* Shift Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{shift.date}</span>
          <span className="text-foreground">{shift.startTime}–{shift.endTime}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{shift.location}</span>
        </div>

        {shift.requester && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>מבקש/ת: {shift.requester}</span>
          </div>
        )}

        {shift.replacement && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <User className="w-4 h-4" />
            <span>מחליף/ה: {shift.replacement}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && onCancel && shift.status === "scheduled" && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="w-full px-4 py-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors"
          >
            לא יכול/ה להגיע
          </button>
        </div>
      )}

      {onTake && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTake();
            }}
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary-glow/30 transition-all"
          >
            {takeLabel || "לקיחת משמרת"}
          </button>
        </div>
      )}

      {/* Glow Effect */}
      {shift.status === "approved" && (
        <div className="absolute inset-0 bg-primary-glow opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-lg" />
      )}
    </div>
  );
}
