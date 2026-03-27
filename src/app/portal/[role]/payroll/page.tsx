import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { PageHeader } from "@/components/portal/page-header";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { canAccess, employeeRecords, getVisibleEmployees, isRole, roleNames } from "@/lib/data";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";

export default async function PayrollPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isRole(role)) {
    notFound();
  }

  if (!canAccess(role, "payroll")) {
    return (
      <AccessDenied
        title="Payroll controls are not available here."
        message="Managers do not get payroll access. Employees can see only their own transaction history and salary progression, never company-wide compensation records."
      />
    );
  }

  const employees = getVisibleEmployees(role);
  const payoutTotal = employeeRecords.reduce((sum, employee) => sum + employee.salary, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title={
          role === "employee"
            ? "Your private payroll and salary history."
            : "Payroll stays secure, role-scoped, and easy to reconcile."
        }
        description="This screen models a protected payment flow. HR and Owner can oversee company compensation activity, while employees see only their own record."
        primaryAction={
          role === "employee"
            ? undefined
            : {
                label: "Process payroll",
                hint: "Run payout",
              }
        }
        centered={role === "employee"}
      />

      {role !== "employee" ? (
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Total payout", formatCompactCurrency(payoutTotal)],
            ["Scheduled", "31 Mar 2026"],
            ["Exceptions", "02 flagged"],
          ].map(([label, value]) => (
            <SpotlightPanel key={label} className="p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-3 font-heading text-2xl text-white">{value}</p>
            </SpotlightPanel>
          ))}
        </section>
      ) : null}

      <SpotlightPanel className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Transactions</p>
            <h2 className="mt-2 font-heading text-2xl text-white">
              {role === "employee" ? "My payment history" : "Payroll ledger"}
            </h2>
          </div>
          {role !== "employee" ? (
            <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.16em] text-slate-300">
              HR and Owner only
            </p>
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="rounded-[24px] border border-white/12 bg-white/8 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {employee.department} • Current salary {formatCurrency(employee.salary)}
                  </p>
                </div>
                <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyan-50">
                  Next renewal {employee.nextRenewal}
                </div>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                {employee.transactions.map((transaction) => (
                  <div
                    key={`${employee.id}-${transaction.date}-${transaction.amount}`}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">{transaction.note}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {transaction.date}
                        </p>
                      </div>
                      <p className="text-sm text-slate-200">{transaction.status}</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SpotlightPanel>
    </div>
  );
}
