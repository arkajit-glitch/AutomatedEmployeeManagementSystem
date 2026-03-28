import Link from "next/link";
import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { PageHeader } from "@/components/portal/page-header";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { StatusPill } from "@/components/ui/status-pill";
import { isRole, roleNames } from "@/lib/data";
import { getProjectDetail, listEmployees } from "@/lib/server/aems-service";
import { projectStatusClass } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ role: string; projectSlug: string }>;
}) {
  const { role, projectSlug } = await params;

  if (!isRole(role)) {
    notFound();
  }

  const project = await getProjectDetail(role, projectSlug);

  if (!project) {
    notFound();
  }

  const visibleEmployees = await listEmployees(role);
  const canViewProject =
    role !== "employee" || visibleEmployees.some((employee) => employee.project === project.name);

  if (!canViewProject) {
    return (
      <AccessDenied
        title="That project is outside your access scope."
        message="Employees can open only the projects assigned to them, while leadership roles keep broader project visibility."
      />
    );
  }

  const projectMembers =
    role === "owner" || role === "hr"
      ? await listEmployees("owner").then((employees) =>
          employees.filter((employee) => employee.project === project.name),
        )
      : visibleEmployees.filter((employee) => employee.project === project.name);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title={project.name}
        description={project.overview}
        primaryAction={
          ["owner", "hr"].includes(role)
            ? {
                label: "Edit project",
                href: `/portal/${role}/projects/${project.slug}/edit`,
                hint: "Manage project",
              }
            : {
                label: "Back to projects",
                href: `/portal/${role}/projects`,
                hint: "Project list",
              }
        }
        centered={role === "employee"}
      />

      <SpotlightPanel className="p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-50">
                {project.department}
              </p>
              <p
                className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${projectStatusClass(project.status)}`}
              >
                {project.status}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Topic</p>
              <h2 className="text-3xl font-semibold text-white">{project.topic}</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-slate-300">{project.summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[420px]">
            {[
              ["Project Head", project.lead],
              ["Client", project.client],
              ["Start Date", project.startDate],
              ["End Date", project.endDate],
              ["Deadline", project.deadline],
              ["Members", String(project.members)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </SpotlightPanel>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
        <div className="space-y-6">
          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Project Description</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{project.overview}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ["Department", project.department],
                ["Project Head", project.lead],
                ["Delivery Window", `${project.startDate} to ${project.endDate}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Objectives</h2>
            <div className="mt-6 grid gap-4">
              {project.objectives.map((objective) => (
                <div
                  key={objective}
                  className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm leading-7 text-slate-200"
                >
                  {objective}
                </div>
              ))}
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Deliverables</h2>
            <div className="mt-6 grid gap-4">
              {project.deliverables.map((deliverable) => (
                <div
                  key={deliverable}
                  className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm leading-7 text-slate-200"
                >
                  {deliverable}
                </div>
              ))}
            </div>
          </SpotlightPanel>
        </div>

        <div className="space-y-6">
          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Project Team</h2>
            <div className="mt-6 space-y-3">
              {projectMembers.length > 0 ? (
                projectMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-white/8 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        <Link
                          href={`/portal/${role}/employees/${member.id}`}
                          className="transition hover:text-cyan-100"
                        >
                          {member.name}
                        </Link>
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {member.role} in {member.department}
                      </p>
                    </div>
                    <StatusPill
                      tone={
                        member.status === "Active"
                          ? "positive"
                          : member.status === "Probation"
                            ? "warning"
                            : "critical"
                      }
                    >
                      {member.status}
                    </StatusPill>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm leading-7 text-slate-300">
                  No visible team members are attached to this project in the current role view.
                </div>
              )}
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Technology And Systems</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-cyan-50"
                >
                  {item}
                </span>
              ))}
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Delivery Snapshot</h2>
            <div className="mt-6 grid gap-4">
              {[
                ["Status", project.status],
                ["Client", project.client],
                ["Timeline", `${project.startDate} to ${project.endDate}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </SpotlightPanel>
        </div>
      </section>
    </div>
  );
}
