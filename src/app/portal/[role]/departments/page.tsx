import Link from "next/link";
import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { PageHeader } from "@/components/portal/page-header";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { canAccess, isRole, roleNames } from "@/lib/data";
import { listDepartments } from "@/lib/server/aems-service";

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

  const departments = await listDepartments();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title="Department management stays clean, searchable, and visible at a glance."
        description="Departments hold employee allocations, leadership ownership, and hiring pressure points so HR and senior teams can manage structure without digging through spreadsheets."
        primaryAction={
          ["owner", "hr"].includes(role)
            ? {
                label: "Add department",
                href: `/portal/${role}/departments/new`,
                hint: "Create team",
              }
            : undefined
        }
      />

      <section className="grid gap-4 xl:grid-cols-2">
        {departments.map((department) => (
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

            {["owner", "hr"].includes(role) ? (
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/portal/${role}/departments/${department.id}/edit`}
                  className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cyan-50 transition hover:bg-cyan-300/16"
                >
                  Edit Department
                </Link>
              </div>
            ) : null}

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
