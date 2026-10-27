export function ProgressBar({ value, color = "#58cc02", className = "h-4" }: { value: number; color?: string; className?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={`relative w-full overflow-hidden rounded-full bg-line ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div className="h-full rounded-full transition-[width] duration-500 ease-out" style={{ width: `${pct}%`, background: color }}>
        {/* the glossy highlight stripe */}
        {pct > 6 && <div className="mx-2 mt-[3px] h-[28%] rounded-full bg-white/30" />}
      </div>
    </div>
  );
}
