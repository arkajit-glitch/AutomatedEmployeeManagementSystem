"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatedButton } from "@/components/ui/animated-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { roleNames, type Role } from "@/lib/data";

type ProjectCreateFormProps = {
  role: Role;
  departments: Array<{ id: string; name: string }>;
};

const fieldClassName =
  "w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10";

const labelClassName = "text-xs uppercase tracking-[0.18em] text-slate-500";

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

export function ProjectCreateForm({ role, departments }: ProjectCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const response = await fetch(`/api/v1/projects?role=${role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Project creation failed.");
        return;
      }

      startTransition(() => {
        router.push(`/portal/${role}/projects/${result.data.slug}`);
        router.refresh();
      });
    } catch {
      setError("Something went wrong while creating the project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SpotlightPanel className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Project Setup</p>
            <h2 className="text-2xl text-white">Create A New Project</h2>
            <p className="text-sm leading-7 text-slate-300">
              {roleNames[role]} can create a project brief with dates, ownership, scope,
              objectives, deliverables, and stack details.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/12 bg-white/8 p-5 text-sm leading-7 text-slate-300">
            This form saves the project to PostgreSQL and then opens its live project detail page.
          </div>
        </div>
      </SpotlightPanel>

      <form action={handleSubmit} className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Project Identity</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className={labelClassName}>
                  Project Name
                </label>
                <input id="name" name="name" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="topic" className={labelClassName}>
                  Topic
                </label>
                <input id="topic" name="topic" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="leadName" className={labelClassName}>
                  Project Head
                </label>
                <input id="leadName" name="leadName" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="departmentName" className={labelClassName}>
                  Department
                </label>
                <select id="departmentName" name="departmentName" className={fieldClassName}>
                  {departments.map((department) => (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="client" className={labelClassName}>
                  Client
                </label>
                <input id="client" name="client" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className={labelClassName}>
                  Status
                </label>
                <select id="status" name="status" className={fieldClassName} defaultValue="Planning">
                  <option value="Planning">Planning</option>
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="startDate" className={labelClassName}>
                  Start Date
                </label>
                <input id="startDate" name="startDate" type="date" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="deadline" className={labelClassName}>
                  Deadline
                </label>
                <input id="deadline" name="deadline" type="date" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className={labelClassName}>
                  End Date
                </label>
                <input id="endDate" name="endDate" type="date" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="members" className={labelClassName}>
                  Team Size
                </label>
                <input
                  id="members"
                  name="members"
                  type="number"
                  min="1"
                  defaultValue="1"
                  className={fieldClassName}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="summary" className={labelClassName}>
                  Summary
                </label>
                <textarea id="summary" name="summary" rows={3} className={fieldClassName} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="overview" className={labelClassName}>
                  Overview
                </label>
                <textarea id="overview" name="overview" rows={5} className={fieldClassName} required />
              </div>
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Project Structure</h2>
            <div className="mt-6 grid gap-4">
              <div className="space-y-2">
                <label htmlFor="objectives" className={labelClassName}>
                  Objectives
                </label>
                <textarea
                  id="objectives"
                  name="objectives"
                  rows={5}
                  className={fieldClassName}
                  placeholder="One objective per line"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="deliverables" className={labelClassName}>
                  Deliverables
                </label>
                <textarea
                  id="deliverables"
                  name="deliverables"
                  rows={5}
                  className={fieldClassName}
                  placeholder="One deliverable per line"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stack" className={labelClassName}>
                  Technology Or Systems
                </label>
                <textarea
                  id="stack"
                  name="stack"
                  rows={4}
                  className={fieldClassName}
                  placeholder="Comma-separated values"
                  required
                />
              </div>
            </div>
          </SpotlightPanel>
        </section>

        {error ? (
          <div className="rounded-2xl border border-rose-300/24 bg-rose-300/10 px-4 py-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <AnimatedButton href={`/portal/${role}/projects`} hint="Back to list" variant="ghost">
            Cancel
          </AnimatedButton>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full border border-cyan-300/24 bg-cyan-300/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50 transition hover:bg-cyan-300/22 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating Project" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
