import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { PageHeader } from "@/components/portal/page-header";
import { ProjectCreateForm } from "@/components/portal/project-create-form";
import { isRole, roleNames } from "@/lib/data";
import { listDepartments } from "@/lib/server/aems-service";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isRole(role)) {
    notFound();
  }

  if (!["owner", "hr"].includes(role)) {
    return (
      <AccessDenied
        title="Only Owner and HR can create projects."
        message="Managers can review and track projects, but new project creation stays restricted to the leadership and HR control layer in this version."
      />
    );
  }

  const departments = await listDepartments();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title="Create A New Project Brief"
        description="Set up a new project with ownership, dates, status, scope, deliverables, and technology details so it becomes part of the live AEMS project directory."
      />
      <ProjectCreateForm
        role={role}
        departments={departments.map((department) => ({
          id: department.id,
          name: department.name,
        }))}
      />
    </div>
  );
}
