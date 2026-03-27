import { notFound } from "next/navigation";

import { DashboardStatGrid } from "@/components/portal/dashboard-stat-grid";
import { PageHeader } from "@/components/portal/page-header";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import {
  employeeRecords,
  getVisibleEmployees,
  isRole,
  projectRecords,
  roleNames,
} from "@/lib/data";
import { formatCurrency, projectStatusClass } from "@/lib/utils";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isRole(role)) {
    notFound();
  }

  const employees = getVisibleEmployees(role);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title="A single command center for people, projects, payroll, and growth."
        description="The dashboard surfaces the metrics and actions that matter most to the signed-in role, while keeping private data locked behind the right access boundary."
        primaryAction={{
          label: role === "employee" ? "Open my profile" : "Add employee",
          href:
            role === "employee"
              ? `/portal/${role}/employees/${employees[0]?.id}`
              : `/portal/${role}/employees`,
          hint: role === "employee" ? "Personal records" : "Create records",
        }}
        centered={role === "employee"}
      />

      <DashboardStatGrid role={role} />

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.95fr]">
        <SpotlightPanel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">
                Watchlist
              </p>
              <h2 className="mt-2 font-heading text-2xl text-white">
                Priority people actions
              </h2>
            </div>
            <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.18em] text-slate-300">
              Refreshed today
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {employees.slice(0, 4).map((employee) => (
              <div
                key={employee.id}
                className="rounded-[24px] border border-white/12 bg-white/8 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">
                      {employee.department} • {employee.role}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-slate-300">
                    <span className="rounded-full border border-amber-300/15 bg-amber-300/10 px-3 py-1 text-amber-100">
                      Renewal {employee.nextRenewal}
                    </span>
                    <span className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-cyan-50">
                      Appraisal {employee.appraisal.rating}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{employee.appraisal.summary}</p>
              </div>
            ))}
          </div>
        </SpotlightPanel>

        <div className="grid gap-6">
          <SpotlightPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Payroll pulse</p>
            <h2 className="mt-2 font-heading text-2xl font-black text-white [text-shadow:0_0_18px_rgba(255,255,255,0.3)]">
              {role === "employee"
                ? "My Compensation Snapshot"
                : role === "manager"
                  ? "Compensation Access"
                  : "Compensation Snapshot"}
            </h2>

            {role === "employee" ? (
              <div className="mt-6 space-y-4">
                {employees.slice(0, 1).map((employee) => (
                  <div
                    key={employee.id}
                    className="rounded-[24px] border border-white/12 bg-white/8 p-5"
                  >
                    <p className="text-lg font-semibold text-white">{employee.name}</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Current salary
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                          {formatCurrency(employee.salary)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Last hike
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                          {employee.lastHikePercent}%
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Next renewal
                        </p>
                        <p className="mt-2 text-sm text-slate-200">{employee.nextRenewal}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : role === "manager" ? (
              <div className="mt-6 rounded-[24px] border border-white/12 bg-white/8 p-5">
                <p className="text-sm leading-7 text-slate-300">
                  Managers can track project execution, team status, appraisal outcomes, and daily
                  updates, but salary and payroll values stay restricted to Owner, HR, and the
                  individual employee.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {employeeRecords.slice(0, 4).map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{employee.name}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {employee.lastHikePercent}% latest hike
                      </p>
                    </div>
                    <p className="text-sm text-slate-200">{formatCurrency(employee.salary)}</p>
                  </div>
                ))}
              </div>
            )}
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Projects</p>
            <h2 className="mt-2 font-heading text-2xl font-black text-white [text-shadow:0_0_18px_rgba(255,255,255,0.3)]">
              Delivery Status Board
            </h2>
            <div className="mt-6 space-y-4">
              {projectRecords.map((project) => (
                <div
                  key={project.name}
                  className="rounded-2xl border border-white/12 bg-white/8 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{project.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {project.department} • Lead {project.lead}
                      </p>
                    </div>
                    <p
                      className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${projectStatusClass(project.status)}`}
                    >
                      {project.status}
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{project.summary}</p>
                </div>
              ))}
            </div>
          </SpotlightPanel>
        </div>
      </section>
    </div>
  );
}
