import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { PageHeader } from "@/components/portal/page-header";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { canAccess, departmentRecords, isRole, roleNames } from "@/lib/data";

export default async function DepartmentsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isRole(role)) {
    notFound();
  }

  if (!canAccess(role, "departments")) {
    return (
      <AccessDenied
        title="Department controls are restricted."
        message="This section is available only to Owner, HR, and Manager accounts. Employees should only interact with their personal workspace and project assignments."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title="Department management stays clean, searchable, and visible at a glance."
        description="Departments hold employee allocations, leadership ownership, and hiring pressure points so HR and senior teams can manage structure without digging through spreadsheets."
        primaryAction={{
          label: "Add department",
          hint: "Create team",
        }}
      />

      <section className="grid gap-4 xl:grid-cols-2">
        {departmentRecords.map((department) => (
          <SpotlightPanel key={department.name} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Department</p>
                <h2 className="mt-2 font-heading text-2xl text-white">{department.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Headed by {department.head} with active coordination between employee records,
                  project load, and renewal planning.
                </p>
              </div>
              <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                {department.status}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Employees</p>
                <p className="mt-2 text-xl font-semibold text-white">{department.employees}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Open roles</p>
                <p className="mt-2 text-xl font-semibold text-white">{department.openRoles}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                <p className="mt-2 text-xl font-semibold text-white">{department.status}</p>
              </div>
            </div>
          </SpotlightPanel>
        ))}
      </section>
    </div>
  );
}
