import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/portal/access-denied";
import { EmployeeCreateForm } from "@/components/portal/employee-create-form";
import { PageHeader } from "@/components/portal/page-header";
import { isRole, roleNames } from "@/lib/data";

export default async function NewEmployeePage({
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
        title="Only Owner and HR can create employee records."
        message="Managers and employees can review people information, but new employee creation stays restricted to leadership and HR operations."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${roleNames[role]} workspace`}
        title="Add A New Employee To The AEMS Directory"
        description="This flow captures the first secure employee record with identity, assignment, compensation, renewal, and reporting details."
      />
      <EmployeeCreateForm role={role} />
    </div>
  );
}
