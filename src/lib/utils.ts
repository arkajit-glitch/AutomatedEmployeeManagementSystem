export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function projectStatusClass(status: string) {
  if (status === "On Track") {
    return "border-emerald-300/35 bg-emerald-300/14 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.28)]";
  }

  if (status === "Planning") {
    return "border-amber-300/35 bg-amber-300/16 text-amber-50 shadow-[0_0_18px_rgba(245,158,11,0.22)]";
  }

  if (status === "At Risk") {
    return "border-rose-300/40 bg-rose-300/18 text-rose-50 shadow-[0_0_22px_rgba(244,63,94,0.3)]";
  }

  return "border-white/10 bg-white/5 text-slate-200";
}
