import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/portal/page-header";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { isRole, roleNames } from "@/lib/data";
import { listProjects } from "@/lib/server/aems-service";
import { projectStatusClass } from "@/lib/utils";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isRole(role)) {
    notFound();
  }

  const projects = await listProjects(role);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title="Projects connect workforce planning with daily execution."
        description="Managers see delivery risk, HR sees coordination updates, and employees track only the projects assigned to them. The structure keeps context useful without overexposing internal data."
        primaryAction={
          role === "employee" || role === "manager"
            ? undefined
            : {
                label: "Create project",
                href: `/portal/${role}/projects/new`,
                hint: "New project",
              }
        }
        centered={role === "employee"}
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
        <div className="grid gap-4">
          {projects.map((project) => (
              <SpotlightPanel key={project.name} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">
                      {project.department}
                    </p>
                    <h2 className="mt-2 font-heading text-2xl text-white">
                      <Link
                        href={`/portal/${role}/projects/${project.slug}`}
                        className="transition hover:text-cyan-100"
                      >
                        {project.name}
                      </Link>
                    </h2>
                  </div>
                  <p
                    className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${projectStatusClass(project.status)}`}
                  >
                    {project.status}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{project.summary}</p>
                {["owner", "hr"].includes(role) ? (
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/portal/${role}/projects/${project.slug}/edit`}
                      className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cyan-50 transition hover:bg-cyan-300/16"
                    >
                      Edit Project
                    </Link>
                  </div>
                ) : null}
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    ["Lead", project.lead],
                    ["Members", String(project.members)],
                    ["Deadline", project.deadline],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                      <p className="mt-2 text-sm text-slate-200">{value}</p>
                    </div>
                  ))}
                </div>
              </SpotlightPanel>
            ))}
        </div>

        <SpotlightPanel className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Daily update rail</p>
          <h2 className="mt-2 font-heading text-2xl text-white">Operational notes</h2>
          <div className="mt-6 space-y-4">
            {[
              "HR synced pending documents for the AEMS rollout team.",
              "Engineering requested one additional designer for the next sprint.",
              "Finance flagged payout approval dependency before month end.",
              "Operations marked one manager on leave and reassigned approvals.",
            ].map((note) => (
              <div key={note} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4">
                <p className="text-sm leading-7 text-slate-200">{note}</p>
              </div>
            ))}
          </div>
        </SpotlightPanel>
      </section>
    </div>
  );
}
