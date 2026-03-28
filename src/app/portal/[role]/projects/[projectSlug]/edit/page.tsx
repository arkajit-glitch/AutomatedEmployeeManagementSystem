import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { PageHeader } from "@/components/portal/page-header";
import { ProjectEditForm } from "@/components/portal/project-edit-form";
import { isRole, roleNames } from "@/lib/data";
import { getProjectDetail, listDepartments } from "@/lib/server/aems-service";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ role: string; projectSlug: string }>;
}) {
  const { role, projectSlug } = await params;

  if (!isRole(role)) {
    notFound();
  }

  if (!["owner", "hr"].includes(role)) {
    return (
      <AccessDenied
        title="Only Owner and HR can edit projects."
        message="Managers can track delivery and view project details, but editing and deletion remain restricted to HR and leadership."
      />
    );
  }

  const project = await getProjectDetail(role, projectSlug);

  if (!project) {
    notFound();
  }

  const departments = await listDepartments();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title={`Manage ${project.name}`}
        description="Update the project brief, delivery dates, ownership, objectives, and system stack. Deletion is also available from this screen."
      />
      <ProjectEditForm
        role={role}
        project={project}
        departments={departments.map((department) => ({
          id: department.id,
          name: department.name,
        }))}
      />
    </div>
  );
}
