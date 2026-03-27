import { cn } from "@/lib/utils";

type StatusPillProps = {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "warning" | "critical";
};

export function StatusPill({ children, tone = "neutral" }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.16em] uppercase",
        tone === "positive" && "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
        tone === "warning" && "border-amber-400/25 bg-amber-400/10 text-amber-100",
        tone === "critical" && "border-rose-400/25 bg-rose-400/10 text-rose-100",
        tone === "neutral" && "border-white/12 bg-white/5 text-slate-200",
      )}
    >
      {children}
    </span>
  );
}
