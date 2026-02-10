export function ShiftLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
        <span className="text-foreground">בוקר</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
        <span className="text-foreground">ערב</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-violet-500" />
        <span className="text-foreground">לילה</span>
      </div>
    </div>
  );
}
