"use client";

import { useMemo, useState } from "react";

import { StatCard } from "@/components/portal/stat-card";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { getDashboardStatDrilldowns, getOverviewStats, Role } from "@/lib/data";
import { projectStatusClass } from "@/lib/utils";

type DashboardStatGridProps = {
  role: Role;
};

function valueTone(value?: string) {
  if (!value) {
    return "text-slate-200";
  }

  if (["On Track", "Verified", "Done", "Live"].includes(value)) {
    return "text-emerald-200";
  }

  if (["Planning", "Pending", "Updated"].includes(value)) {
    return "text-amber-100";
  }

  if (["At Risk", "Attention"].includes(value)) {
    return "text-rose-100";
  }

  return "text-cyan-100";
}

export function DashboardStatGrid({ role }: DashboardStatGridProps) {
  const stats = useMemo(() => getOverviewStats(role), [role]);
  const drilldowns = useMemo(() => getDashboardStatDrilldowns(role), [role]);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const activeDrilldown = useMemo(
    () => drilldowns.find((item) => item.label === activeLabel) ?? null,
    [activeLabel, drilldowns],
  );

  return (
    <div className="space-y-4">
      <section
        className={`grid gap-4 ${stats.length === 4 ? "xl:grid-cols-4" : "md:grid-cols-3"}`}
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            isActive={activeLabel === stat.label}
            onIconClick={() =>
              setActiveLabel((current) => (current === stat.label ? null : stat.label))
            }
          />
        ))}
      </section>

      {activeDrilldown ? (
        <SpotlightPanel className="p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">
                Icon detail view
              </p>
              <h3 className="mt-2 font-heading text-2xl text-white">{activeDrilldown.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                {activeDrilldown.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveLabel(null)}
              className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/12"
            >
              Close Details
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {activeDrilldown.items.map((item) => (
              <div
                key={`${activeDrilldown.label}-${item.title}-${item.subtitle}`}
                className="rounded-[24px] border border-white/12 bg-white/8 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.subtitle}</p>
                  </div>
                  {item.status ? (
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${projectStatusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  ) : null}
                </div>
                {item.value ? (
                  <p className={`mt-4 text-sm font-medium ${valueTone(item.value)}`}>{item.value}</p>
                ) : null}
              </div>
            ))}
          </div>
        </SpotlightPanel>
      ) : null}
    </div>
  );
}
