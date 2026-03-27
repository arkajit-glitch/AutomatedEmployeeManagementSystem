import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { PageHeader } from "@/components/portal/page-header";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { StatusPill } from "@/components/ui/status-pill";
import { employeeRecords, getVisibleEmployees, isRole, roleNames } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ role: string; employeeId: string }>;
}) {
  const { role, employeeId } = await params;

  if (!isRole(role)) {
    notFound();
  }

  const employee = employeeRecords.find((entry) => entry.id === employeeId);

  if (!employee) {
    notFound();
  }

  const visibleIds = new Set(getVisibleEmployees(role).map((entry) => entry.id));

  if (!visibleIds.has(employee.id)) {
    return (
      <AccessDenied
        title="That employee record is outside your access scope."
        message="Managers see only their visible teams, and employees can open only their own card, documents, payment history, and growth details."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title={`${employee.name} • complete employee lifecycle`}
        description="This page ties together profile details, achievements, appraisals, hikes, salary and contract renewals, documents, project assignments, and private payment visibility."
      />

      <SpotlightPanel className="p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/12 bg-white/10 text-2xl font-semibold text-white">
              {employee.avatar}
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-heading text-3xl text-white">{employee.name}</h2>
                <StatusPill
                  tone={
                    employee.status === "Active"
                      ? "positive"
                      : employee.status === "Probation"
                        ? "warning"
                        : "critical"
                  }
                >
                  {employee.status}
                </StatusPill>
              </div>
              <p className="text-sm leading-7 text-slate-300">
                {employee.role} in {employee.department} • reports to {employee.manager} • based in{" "}
                {employee.location}
              </p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {employee.id}
                </span>
                <span className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-cyan-50">
                  Appraisal {employee.appraisal.rating}
                </span>
                <span className="rounded-full border border-amber-300/18 bg-amber-300/10 px-3 py-1 text-amber-50">
                  Next renewal {employee.nextRenewal}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current salary</p>
              <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(employee.salary)}</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Last hike</p>
              <p className="mt-2 text-xl font-semibold text-white">{employee.lastHikePercent}%</p>
            </div>
          </div>
        </div>
      </SpotlightPanel>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
        <div className="space-y-6">
          <SpotlightPanel className="p-6">
            <h3 className="font-heading text-2xl text-white">Profile details</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Email", employee.email],
                ["Phone", employee.phone],
                ["Experience", employee.experience],
                ["Current project", employee.project],
                ["Last appraisal", employee.lastAppraisal],
                ["Contract expiry", employee.contractExpiry],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <h3 className="font-heading text-2xl text-white">Achievements and documents</h3>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[24px] border border-white/12 bg-white/8 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Achievements</p>
                <div className="mt-4 space-y-3">
                  {employee.achievements.map((achievement) => (
                    <div
                      key={achievement}
                      className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm leading-7 text-slate-200"
                    >
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/8 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">PDF documents</p>
                <div className="mt-4 space-y-3">
                  {employee.documents.map((document) => (
                    <div
                      key={document.label}
                      className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 px-4 py-3"
                    >
                      <p className="text-sm text-slate-200">{document.label}</p>
                      <StatusPill tone={document.state === "Verified" ? "positive" : "warning"}>
                        {document.state}
                      </StatusPill>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <h3 className="font-heading text-2xl text-white">Appraisal, hikes, and renewals</h3>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] border border-white/12 bg-white/8 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Latest appraisal</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  {employee.appraisal.cycle} • {employee.appraisal.rating} • Reviewed by{" "}
                  {employee.appraisal.reviewer}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {employee.appraisal.summary}
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/12 bg-white/8 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Salary history</p>
                  <div className="mt-4 space-y-3">
                    {employee.salaryHistory.map((entry) => (
                      <div
                        key={`${entry.date}-${entry.updated}`}
                        className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3"
                      >
                        <p className="text-sm font-medium text-white">{entry.date}</p>
                        <p className="mt-1 text-sm text-slate-300">
                          {formatCurrency(entry.previous)} to {formatCurrency(entry.updated)}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {entry.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Contract history</p>
                  <div className="mt-4 space-y-3">
                    {employee.contractHistory.map((entry) => (
                      <div
                        key={`${entry.renewedOn}-${entry.expiresOn}`}
                        className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3"
                      >
                        <p className="text-sm font-medium text-white">
                          {entry.term} • {entry.status}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          Renewed {entry.renewedOn} • Expires {entry.expiresOn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SpotlightPanel>
        </div>

        <div className="space-y-6">
          <SpotlightPanel className="p-6">
            <h3 className="font-heading text-2xl text-white">Payment visibility</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              This section shows only transactions between the employee and HR. No cross-employee
              payment data is exposed anywhere in the portal.
            </p>
            <div className="mt-6 space-y-3">
              {employee.transactions.map((transaction) => (
                <div
                  key={`${transaction.date}-${transaction.amount}`}
                  className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">{transaction.note}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {transaction.date}
                      </p>
                    </div>
                    <StatusPill tone={transaction.status === "Paid" ? "positive" : "warning"}>
                      {transaction.status}
                    </StatusPill>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <h3 className="font-heading text-2xl text-white">Project involvement</h3>
            <div className="mt-4 rounded-[24px] border border-white/12 bg-white/8 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Assigned project</p>
              <p className="mt-3 text-xl font-semibold text-white">{employee.project}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Current manager: {employee.manager}. Status updates and daily progress stay visible
                according to the signed-in role.
              </p>
            </div>
          </SpotlightPanel>
        </div>
      </section>
    </div>
  );
}
