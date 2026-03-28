"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatedButton } from "@/components/ui/animated-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { type DepartmentApiRecord } from "@/lib/server/aems-service";
import { type Role } from "@/lib/data";

type DepartmentEditFormProps = {
  role: Role;
  department: DepartmentApiRecord;
};

const fieldClassName =
  "w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10";

const labelClassName = "text-xs uppercase tracking-[0.18em] text-slate-500";

export function DepartmentEditForm({ role, department }: DepartmentEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      const response = await fetch(`/api/v1/departments/${department.id}?role=${role}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Department update failed.");
        return;
      }

      startTransition(() => {
        router.push(`/portal/${role}/departments`);
        router.refresh();
      });
    } catch {
      setError("Something went wrong while updating the department.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/departments/${department.id}?role=${role}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Department deletion failed.");
        return;
      }

      startTransition(() => {
        router.push(`/portal/${role}/departments`);
        router.refresh();
      });
    } catch {
      setError("Something went wrong while deleting the department.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <SpotlightPanel className="p-6">
        <h2 className="text-2xl text-white">Department Settings</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className={labelClassName}>
              Department Name
            </label>
            <input id="name" name="name" defaultValue={department.name} className={fieldClassName} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="code" className={labelClassName}>
              Department Code
            </label>
            <input id="code" name="code" defaultValue={department.code ?? ""} className={fieldClassName} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="headName" className={labelClassName}>
              Department Head
            </label>
            <input id="headName" name="headName" defaultValue={department.head} className={fieldClassName} required />
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
              defaultValue={department.openRoles}
              className={fieldClassName}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="status" className={labelClassName}>
              Department Status
            </label>
            <select id="status" name="status" defaultValue={department.status} className={fieldClassName}>
              <option value="Healthy">Healthy</option>
              <option value="Hiring">Hiring</option>
              <option value="Needs Review">Needs Review</option>
            </select>
          </div>
        </div>
      </SpotlightPanel>

      <SpotlightPanel className="p-6">
        <h2 className="text-2xl text-white">Danger Zone</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Deleting a department works only when it has no employees or projects attached. If it is
          still in use, AEMS will block the deletion to protect your data integrity.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-full border border-rose-300/24 bg-rose-300/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-100 transition hover:bg-rose-300/22 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting Department" : "Delete Department"}
          </button>
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
          {isSubmitting ? "Saving Changes" : "Save Department"}
        </button>
      </div>
    </form>
  );
}
