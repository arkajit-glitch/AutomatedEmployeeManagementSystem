"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatedButton } from "@/components/ui/animated-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { roleNames, type Role } from "@/lib/data";

type DepartmentCreateFormProps = {
  role: Role;
};

const fieldClassName =
  "w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10";

const labelClassName = "text-xs uppercase tracking-[0.18em] text-slate-500";

export function DepartmentCreateForm({ role }: DepartmentCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      code: String(formData.get("code") ?? ""),
      headName: String(formData.get("headName") ?? ""),
      openRoles: Number(formData.get("openRoles") ?? 0),
      status: String(formData.get("status") ?? ""),
    };

    try {
      const response = await fetch(`/api/v1/departments?role=${role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Department creation failed.");
        return;
      }

      startTransition(() => {
        router.push(`/portal/${role}/departments`);
        router.refresh();
      });
    } catch {
      setError("Something went wrong while creating the department.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SpotlightPanel className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">
              Department Setup
            </p>
            <h2 className="text-2xl text-white">Create A New Department</h2>
            <p className="text-sm leading-7 text-slate-300">
              {roleNames[role]} can create a department, assign its head, and define its hiring
              pressure before employees are added under it.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/12 bg-white/8 p-5 text-sm leading-7 text-slate-300">
            This writes straight into PostgreSQL now, so newly created departments immediately
            become available to the rest of the AEMS backend.
          </div>
        </div>
      </SpotlightPanel>

      <form action={handleSubmit} className="space-y-6">
        <SpotlightPanel className="p-6">
          <h2 className="text-2xl text-white">Department Details</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className={labelClassName}>
                Department Name
              </label>
              <input id="name" name="name" className={fieldClassName} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="code" className={labelClassName}>
                Department Code
              </label>
              <input id="code" name="code" className={fieldClassName} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="headName" className={labelClassName}>
                Department Head
              </label>
              <input id="headName" name="headName" className={fieldClassName} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="openRoles" className={labelClassName}>
                Open Roles
              </label>
              <input
                id="openRoles"
                name="openRoles"
                type="number"
                min="0"
                defaultValue="0"
                className={fieldClassName}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="status" className={labelClassName}>
                Department Status
              </label>
              <select id="status" name="status" className={fieldClassName} defaultValue="Healthy">
                <option value="Healthy">Healthy</option>
                <option value="Hiring">Hiring</option>
                <option value="Needs Review">Needs Review</option>
              </select>
            </div>
          </div>
        </SpotlightPanel>

        {error ? (
          <div className="rounded-2xl border border-rose-300/24 bg-rose-300/10 px-4 py-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <AnimatedButton href={`/portal/${role}/departments`} hint="Back to list" variant="ghost">
            Cancel
          </AnimatedButton>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full border border-cyan-300/24 bg-cyan-300/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50 transition hover:bg-cyan-300/22 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating Department" : "Create Department"}
          </button>
        </div>
      </form>
    </div>
  );
}
