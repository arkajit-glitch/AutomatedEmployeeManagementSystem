import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { DepartmentEditForm } from "@/components/portal/department-edit-form";
import { PageHeader } from "@/components/portal/page-header";
import { isRole, roleNames } from "@/lib/data";
import { getDepartmentDetail } from "@/lib/server/aems-service";

export default async function EditDepartmentPage({
  params,
}: {
  params: Promise<{ role: string; departmentId: string }>;
}) {
  const { role, departmentId } = await params;

  if (!isRole(role)) {
    notFound();
  }

  if (!["owner", "hr"].includes(role)) {
    return (
      <AccessDenied
        title="Only Owner and HR can edit departments."
        message="Managers can view department structure, but editing stays restricted to HR and leadership in this version."
      />
    );
  }

  const department = await getDepartmentDetail(role, departmentId);

  if (!department) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title={`Manage ${department.name}`}
        description="Update department ownership, code, hiring pressure, and operational status. Deletion is available here only when the department no longer owns employees or projects."
      />
      <DepartmentEditForm role={role} department={department} />
    </div>
  );
}
