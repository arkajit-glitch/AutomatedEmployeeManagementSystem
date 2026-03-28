"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatedButton } from "@/components/ui/animated-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { type Role } from "@/lib/data";
import { type ProjectApiRecord } from "@/lib/server/aems-service";

type ProjectEditFormProps = {
  role: Role;
  project: ProjectApiRecord;
  departments: Array<{ id: string; name: string }>;
};

const fieldClassName =
  "w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10";

const labelClassName = "text-xs uppercase tracking-[0.18em] text-slate-500";

function joinLines(values: string[]) {
  return values.join("\n");
}

function joinComma(values: string[]) {
  return values.join(", ");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitCommaValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProjectEditForm({ role, project, departments }: ProjectEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      leadName: String(formData.get("leadName") ?? ""),
      departmentName: String(formData.get("departmentName") ?? ""),
      status: String(formData.get("status") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      deadline: String(formData.get("deadline") ?? ""),
      endDate: String(formData.get("endDate") ?? ""),
      client: String(formData.get("client") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      overview: String(formData.get("overview") ?? ""),
      members: Number(formData.get("members") ?? 1),
      objectives: splitLines(String(formData.get("objectives") ?? "")),
      deliverables: splitLines(String(formData.get("deliverables") ?? "")),
      stack: splitCommaValues(String(formData.get("stack") ?? "")),
    };

    try {
      const response = await fetch(`/api/v1/projects/${project.slug}?role=${role}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Project update failed.");
        return;
      }

      startTransition(() => {
        router.push(`/portal/${role}/projects/${result.data.slug}`);
        router.refresh();
      });
    } catch {
      setError("Something went wrong while updating the project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/projects/${project.slug}?role=${role}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Project deletion failed.");
        return;
      }

      startTransition(() => {
        router.push(`/portal/${role}/projects`);
        router.refresh();
      });
    } catch {
      setError("Something went wrong while deleting the project.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <SpotlightPanel className="p-6">
        <h2 className="text-2xl text-white">Project Settings</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className={labelClassName}>Project Name</label>
            <input id="name" name="name" defaultValue={project.name} className={fieldClassName} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="topic" className={labelClassName}>Topic</label>
            <input id="topic" name="topic" defaultValue={project.topic} className={fieldClassName} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="leadName" className={labelClassName}>Project Head</label>
            <input id="leadName" name="leadName" defaultValue={project.lead} className={fieldClassName} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="departmentName" className={labelClassName}>Department</label>
            <select id="departmentName" name="departmentName" defaultValue={project.department} className={fieldClassName}>
              {departments.map((department) => (
                <option key={department.id} value={department.name}>{department.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="client" className={labelClassName}>Client</label>
            <input id="client" name="client" defaultValue={project.client} className={fieldClassName} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className={labelClassName}>Status</label>
            <select id="status" name="status" defaultValue={project.status} className={fieldClassName}>
              <option value="Planning">Planning</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="startDate" className={labelClassName}>Start Date</label>
            <input id="startDate" name="startDate" type="date" defaultValue={toDateInput(project.startDate)} className={fieldClassName} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="deadline" className={labelClassName}>Deadline</label>
            <input id="deadline" name="deadline" type="date" defaultValue={toDateInput(project.deadline)} className={fieldClassName} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="endDate" className={labelClassName}>End Date</label>
            <input id="endDate" name="endDate" type="date" defaultValue={toDateInput(project.endDate)} className={fieldClassName} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="members" className={labelClassName}>Team Size</label>
            <input id="members" name="members" type="number" min="1" defaultValue={project.members} className={fieldClassName} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="summary" className={labelClassName}>Summary</label>
            <textarea id="summary" name="summary" rows={3} defaultValue={project.summary} className={fieldClassName} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="overview" className={labelClassName}>Overview</label>
            <textarea id="overview" name="overview" rows={5} defaultValue={project.overview} className={fieldClassName} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="objectives" className={labelClassName}>Objectives</label>
            <textarea id="objectives" name="objectives" rows={4} defaultValue={joinLines(project.objectives)} className={fieldClassName} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="deliverables" className={labelClassName}>Deliverables</label>
            <textarea id="deliverables" name="deliverables" rows={4} defaultValue={joinLines(project.deliverables)} className={fieldClassName} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="stack" className={labelClassName}>Technology Or Systems</label>
            <textarea id="stack" name="stack" rows={3} defaultValue={joinComma(project.stack)} className={fieldClassName} required />
          </div>
        </div>
      </SpotlightPanel>

      <SpotlightPanel className="p-6">
        <h2 className="text-2xl text-white">Danger Zone</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Deleting a project will remove its live record from the project directory and detach it
          from current visibility flows inside the portal.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-full border border-rose-300/24 bg-rose-300/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-100 transition hover:bg-rose-300/22 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting Project" : "Delete Project"}
          </button>
        </div>
      </SpotlightPanel>

      {error ? (
        <div className="rounded-2xl border border-rose-300/24 bg-rose-300/10 px-4 py-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <AnimatedButton href={`/portal/${role}/projects/${project.slug}`} hint="Back to project" variant="ghost">
          Cancel
        </AnimatedButton>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full border border-cyan-300/24 bg-cyan-300/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50 transition hover:bg-cyan-300/22 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving Changes" : "Save Project"}
        </button>
      </div>
    </form>
  );
}

function toDateInput(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toISOString().slice(0, 10);
}
