"use client";

import { LucideIcon } from "lucide-react";

import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  onIconClick?: () => void;
  isActive?: boolean;
};

export function StatCard({
  icon: Icon,
  label,
  value,
  helper,
  onIconClick,
  isActive = false,
}: StatCardProps) {
  return (
    <SpotlightPanel className="h-full p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="font-heading text-xl text-white">{value}</p>
          <p className="text-sm leading-6 text-slate-300">{helper}</p>
        </div>
        {onIconClick ? (
          <button
            type="button"
            onClick={onIconClick}
            className={cn(
              "rounded-2xl border p-3 text-cyan-100 transition",
              isActive
                ? "border-cyan-200/35 bg-cyan-300/18 shadow-[0_0_22px_rgba(34,211,238,0.18)]"
                : "border-cyan-300/15 bg-cyan-300/10 hover:bg-cyan-300/16",
            )}
            aria-label={`Open ${label} details`}
            title={`Open ${label} details`}
          >
            <Icon className="h-5 w-5" />
          </button>
        ) : (
          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-3 text-cyan-100">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </SpotlightPanel>
  );
}
