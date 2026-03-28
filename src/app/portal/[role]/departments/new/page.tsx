import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { DepartmentCreateForm } from "@/components/portal/department-create-form";
import { PageHeader } from "@/components/portal/page-header";
import { isRole, roleNames } from "@/lib/data";

export default async function NewDepartmentPage({
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
        title="Only Owner and HR can create departments."
        message="Managers can review department structure, but department creation stays restricted to leadership and HR operations."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title="Add A Department To The AEMS Structure"
        description="Create a department with a code, owner, open-role count, and operational status so it can start receiving employees and projects."
      />
      <DepartmentCreateForm role={role} />
    </div>
  );
}
