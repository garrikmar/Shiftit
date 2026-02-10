import { X, Calendar, Clock, MapPin, User, CheckCircle } from "lucide-react";
import { Shift } from "../components/shift-card";
import { useState } from "react";
import { SwapRequestModal } from "./swap-request-modal";

interface ShiftDetailModalProps {
  shift: Shift;
  onClose: () => void;
  onCancel?: () => void;
}

export function ShiftDetailModal({ shift, onClose, onCancel }: ShiftDetailModalProps) {
  const [showSwapModal, setShowSwapModal] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-xl border border-card-border bg-background-secondary p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2>פרטי משמרת</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          {shift.status === "scheduled" && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span className="text-secondary">משמרת מתוכננת</span>
            </div>
          )}
          {shift.status === "pending" && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-warning/10 border border-warning/30">
              <Clock className="w-5 h-5 text-warning" />
              <span className="text-warning">ממתין לאישור</span>
            </div>
          )}
        </div>

        {/* Shift Details */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="mb-1">{shift.title}</h3>
            <p className="text-muted-foreground">{shift.role}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">תאריך</div>
                <div>{shift.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">שעות</div>
                <div dir="ltr">{shift.startTime} - {shift.endTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">מיקום</div>
                <div>{shift.location}</div>
              </div>
            </div>

            {shift.requester && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">מבקש/ת</div>
                  <div>{shift.requester}</div>
                </div>
              </div>
            )}

            {shift.replacement && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-primary">מחליף/ה</div>
                  <div className="text-primary">{shift.replacement}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={() => {
                // Open SwapRequestModal instead of onCancel/onClose
                setShowSwapModal(true);
                onCancel()
              }}
              className="flex-1 px-4 py-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors"
            >
              לא יכול/ה להגיע
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            סגירה
          </button>
        </div>
        </div>
      </div>

      {showSwapModal && (
        <SwapRequestModal
          shift={shift}
          onClose={() => setShowSwapModal(false)}
          onSubmit={(_data) => setShowSwapModal(false)}
        />
      )}
    </>
  );
}
