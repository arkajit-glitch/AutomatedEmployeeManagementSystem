import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { PageHeader } from "@/components/portal/page-header";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { canAccess, isRole, reportHighlights, roleNames } from "@/lib/data";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isRole(role)) {
    notFound();
  }

  if (!canAccess(role, "reports")) {
    return (
      <AccessDenied
        title="Reports are restricted for this account."
        message="Employees stay inside their personal workspace and do not receive company-wide analytics or organization-level reporting access."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title="Reports turn HR operations into a readable decision layer."
        description="This first version focuses on trend summaries for appraisals, payroll confidence, and renewal watchlists so leadership can spot issues before they become operational blockers."
        primaryAction={{
          label: "Export report",
          hint: "Download summary",
        }}
      />

      <section className="grid gap-4 xl:grid-cols-3">
        {reportHighlights.map((highlight) => (
          <SpotlightPanel key={highlight.title} className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Insight</p>
            <h2 className="mt-3 font-heading text-2xl text-white">{highlight.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{highlight.body}</p>
          </SpotlightPanel>
        ))}
      </section>

      <SpotlightPanel className="p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Snapshot table</p>
        <h2 className="mt-2 font-heading text-2xl text-white">Operations overview</h2>
        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/8">
          <table className="min-w-full divide-y divide-white/8 text-left">
            <thead className="bg-white/5">
              <tr className="text-xs uppercase tracking-[0.18em] text-slate-400">
                <th className="px-4 py-4">Metric</th>
                <th className="px-4 py-4">Current</th>
                <th className="px-4 py-4">Trend</th>
                <th className="px-4 py-4">Action note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/8 text-sm text-slate-200">
              {[
                ["Headcount coverage", "47 active", "Stable", "Fill 3 open roles in Operations"],
                ["Document completion", "94%", "Up 6%", "Chase pending verification proofs"],
                ["Appraisal closure", "86%", "Up 9%", "Finalize remaining manager reviews"],
                ["Renewal compliance", "8 due soon", "Needs focus", "Lock dates before payroll cycle"],
              ].map(([metric, current, trend, note]) => (
                <tr key={metric}>
                  <td className="px-4 py-4">{metric}</td>
                  <td className="px-4 py-4">{current}</td>
                  <td className="px-4 py-4">{trend}</td>
                  <td className="px-4 py-4">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpotlightPanel>
    </div>
  );
}
