"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, Check } from "lucide-react";

import { StatCard } from "@/components/portal/stat-card";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { type DashboardDrilldown } from "@/lib/data";
import { type DashboardStatRecord } from "@/lib/server/aems-service";
import { projectStatusClass } from "@/lib/utils";

type DashboardStatGridProps = {
  stats: DashboardStatRecord[];
  drilldowns: DashboardDrilldown[];
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

function statusBadgeClass(value?: string) {
  if (value === "Active") {
    return "border-emerald-300/35 bg-emerald-300/14 text-emerald-100";
  }

  if (value === "Probation") {
    return "border-amber-300/35 bg-amber-300/16 text-amber-50";
  }

  if (value === "On Leave") {
    return "border-rose-300/40 bg-rose-300/18 text-rose-50";
  }

  return null;
}

function renderStatusPill(status?: string) {
  if (!status) {
    return null;
  }

  if (status === "Done") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-300/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
        <Check className="h-3.5 w-3.5" />
        {status}
      </span>
    );
  }

  if (status === "Updated") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/35 bg-orange-300/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-100">
        <ArrowUpRight className="h-3.5 w-3.5" />
        {status}
      </span>
    );
  }

  if (status === "Live") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/35 bg-rose-300/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-100">
        {status}
        <span className="relative ml-1 flex h-4 w-4 items-center justify-center">
          <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-rose-400/45" />
          <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-rose-400" />
        </span>
      </span>
    );
  }

  if (status === "Attention") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/40 bg-rose-300/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-50">
        <AlertCircle className="h-3.5 w-3.5" />
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${projectStatusClass(status)}`}
    >
      {status}
    </span>
  );
}

export function DashboardStatGrid({ stats, drilldowns }: DashboardStatGridProps) {
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
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-base font-semibold text-white transition hover:text-cyan-100"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <p className="text-base font-semibold text-white">{item.title}</p>
                    )}
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.subtitle}</p>
                  </div>
                  {item.status ? renderStatusPill(item.status) : null}
                </div>
                {item.value ? (
                  statusBadgeClass(item.value) ? (
                    <div className="mt-4 flex justify-end">
                      <p
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusBadgeClass(item.value)}`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ) : (
                    <p className={`mt-4 text-sm font-medium ${valueTone(item.value)}`}>
                      {item.value}
                    </p>
                  )
                ) : null}
              </div>
            ))}
          </div>
        </SpotlightPanel>
      ) : null}
    </div>
  );
}
