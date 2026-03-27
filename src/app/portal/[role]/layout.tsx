import { notFound } from "next/navigation";

import { AppShell } from "@/components/portal/app-shell";
import { isRole } from "@/lib/data";

export default async function RoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isRole(role)) {
    notFound();
  }

  return <AppShell role={role}>{children}</AppShell>;
}
