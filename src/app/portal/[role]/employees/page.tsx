import { notFound } from "next/navigation";

import { EmployeeCard } from "@/components/portal/employee-card";
import { PageHeader } from "@/components/portal/page-header";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { isRole, roleNames } from "@/lib/data";
import { listEmployees } from "@/lib/server/aems-service";
import { formatCurrency } from "@/lib/utils";

export default async function EmployeesPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isRole(role)) {
    notFound();
  }

  const employees = await listEmployees(role);
  const employee = role === "employee" ? employees[0] : undefined;

  return (
    <div className="space-y-6">
      <div className={role === "employee" ? "mx-auto w-full max-w-5xl" : ""}>
        <PageHeader
          eyebrow={`${roleNames[role]} workspace`}
          title={
            role === "employee"
              ? "Your personal employee profile and growth history."
              : "Employee records are presented as searchable cards and structured profiles."
          }
          description="Each profile combines contact details, achievements, documents, appraisals, salary hikes, salary renewals, contract renewals, and project assignments in one secure record."
          primaryAction={
            role === "employee" || role === "manager"
              ? undefined
              : {
                  label: "Add employee",
                  href: `/portal/${role}/employees/new`,
                  hint: "Create record",
                }
          }
          centered={role === "employee"}
        />

        {role !== "employee" ? (
          <SpotlightPanel className="mt-6 p-5">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                "Filter by department",
                "Filter by designation",
                "Filter by status",
                "Search employees",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </SpotlightPanel>
        ) : null}

        {role === "employee" && employee ? (
          <div className="mt-6 space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              {[
                ["Current Project", employee.project],
                ["Latest Payout", formatCurrency(employee.latestPayout)],
                ["Next Renewal", employee.nextRenewal],
              ].map(([label, value]) => (
                <SpotlightPanel key={label} className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">{label}</p>
                  <p className="mt-3 font-heading text-2xl text-white">{value}</p>
                </SpotlightPanel>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <EmployeeCard employee={employee} role={role} />

              <div className="grid gap-4">
                <SpotlightPanel className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">
                    Personal Snapshot
                  </p>
                  <div className="mt-5 space-y-4">
                    {[
                      ["Appraisal Status", `${employee.appraisal.rating} • ${employee.appraisal.cycle}`],
                      ["Salary Hike", `${employee.lastHikePercent}% approved`],
                      ["Contract Expiry", employee.contractExpiry],
                      [
                        "Documents Verified",
                        `${employee.documents.filter((document) => document.state === "Verified").length}/${employee.documents.length}`,
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {label}
                        </p>
                        <p className="mt-2 text-sm text-slate-200">{value}</p>
                      </div>
                    ))}
                  </div>
                </SpotlightPanel>

                <SpotlightPanel className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">
                    What You Can Do Here
                  </p>
                  <div className="mt-5 space-y-3">
                    {[
                      "Review your full profile details",
                      "Open your private payment history",
                      "Track your project and appraisal growth",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-slate-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </SpotlightPanel>
              </div>
            </section>
          </div>
        ) : (
          <section className="mt-6 grid gap-4 xl:grid-cols-2">
            {employees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} role={role} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
