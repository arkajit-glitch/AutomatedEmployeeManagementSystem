"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatedButton } from "@/components/ui/animated-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { roleNames, type Role } from "@/lib/data";

type EmployeeCreateFormProps = {
  role: Role;
};

const fieldClassName =
  "w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10";

const labelClassName = "text-xs uppercase tracking-[0.18em] text-slate-500";

export function EmployeeCreateForm({ role }: EmployeeCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      jobTitle: String(formData.get("jobTitle") ?? ""),
      accessRole: String(formData.get("accessRole") ?? ""),
      status: String(formData.get("status") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      experience: String(formData.get("experience") ?? ""),
      location: String(formData.get("location") ?? ""),
      managerName: String(formData.get("managerName") ?? ""),
      departmentName: String(formData.get("departmentName") ?? ""),
      projectName: String(formData.get("projectName") ?? ""),
      currencyCode: String(formData.get("currencyCode") ?? "INR"),
      currentSalary: Number(formData.get("currentSalary") ?? 0),
      latestPayout: Number(formData.get("latestPayout") ?? 0),
      nextRenewal: String(formData.get("nextRenewal") ?? ""),
      contractExpiry: String(formData.get("contractExpiry") ?? ""),
    };

    try {
      const response = await fetch(`/api/v1/employees?role=${role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Employee creation failed.");
        return;
      }

      const record = result.data as { id: string; name: string };
      const wasPersisted = Boolean(result.meta?.persisted);
      setPersisted(wasPersisted);
      setSuccess(
        wasPersisted
          ? `${record.name} has been created and saved to the backend.`
          : `${record.name} has been validated in demo mode. Connect PostgreSQL to persist new employees.`,
      );

      if (wasPersisted) {
        startTransition(() => {
          router.push(`/portal/${role}/employees/${record.id}`);
          router.refresh();
        });
      }
    } catch {
      setError("Something went wrong while sending the form.");
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
              Record Creation
            </p>
            <h2 className="text-2xl text-white">Create A New Employee Profile</h2>
            <p className="text-sm leading-7 text-slate-300">
              {roleNames[role]} can add a new employee here with department, role, salary,
              contract, and reporting details.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/12 bg-white/8 p-5 text-sm leading-7 text-slate-300">
            This form is now connected to the backend endpoint. In demo mode it validates and
            accepts input but does not persist records. Once PostgreSQL is connected, the same
            form will save the employee to the database.
          </div>
        </div>
      </SpotlightPanel>

      <form action={handleSubmit} className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Identity And Contact</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="fullName" className={labelClassName}>
                  Full Name
                </label>
                <input id="fullName" name="fullName" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="jobTitle" className={labelClassName}>
                  Job Title
                </label>
                <input id="jobTitle" name="jobTitle" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className={labelClassName}>
                  Work Email
                </label>
                <input id="email" name="email" type="email" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className={labelClassName}>
                  Phone
                </label>
                <input id="phone" name="phone" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className={labelClassName}>
                  Location
                </label>
                <input id="location" name="location" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="accessRole" className={labelClassName}>
                  Access Role
                </label>
                <select id="accessRole" name="accessRole" className={fieldClassName} defaultValue="employee">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="experience" className={labelClassName}>
                  Experience Summary
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={4}
                  className={fieldClassName}
                  required
                />
              </div>
            </div>
          </SpotlightPanel>

          <SpotlightPanel className="p-6">
            <h2 className="text-2xl text-white">Assignment And Compensation</h2>
            <div className="mt-6 grid gap-4">
              <div className="space-y-2">
                <label htmlFor="departmentName" className={labelClassName}>
                  Department
                </label>
                <select
                  id="departmentName"
                  name="departmentName"
                  className={fieldClassName}
                  defaultValue="Engineering"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="projectName" className={labelClassName}>
                  Current Project
                </label>
                <select id="projectName" name="projectName" className={fieldClassName} defaultValue="">
                  <option value="">Unassigned</option>
                  <option value="AEMS Core Rollout">AEMS Core Rollout</option>
                  <option value="Quarterly Appraisal Cycle">Quarterly Appraisal Cycle</option>
                  <option value="Finance Sync Upgrade">Finance Sync Upgrade</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="managerName" className={labelClassName}>
                  Reporting Manager
                </label>
                <input id="managerName" name="managerName" className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className={labelClassName}>
                  Employment Status
                </label>
                <select id="status" name="status" className={fieldClassName} defaultValue="Active">
                  <option value="Active">Active</option>
                  <option value="Probation">Probation</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="currencyCode" className={labelClassName}>
                  Currency
                </label>
                <select id="currencyCode" name="currencyCode" className={fieldClassName} defaultValue="INR">
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="currentSalary" className={labelClassName}>
                  Current Salary
                </label>
                <input
                  id="currentSalary"
                  name="currentSalary"
                  type="number"
                  min="0"
                  className={fieldClassName}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="latestPayout" className={labelClassName}>
                  Latest Payout
                </label>
                <input
                  id="latestPayout"
                  name="latestPayout"
                  type="number"
                  min="0"
                  className={fieldClassName}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="nextRenewal" className={labelClassName}>
                  Next Renewal
                </label>
                <input
                  id="nextRenewal"
                  name="nextRenewal"
                  type="date"
                  className={fieldClassName}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contractExpiry" className={labelClassName}>
                  Contract Expiry
                </label>
                <input
                  id="contractExpiry"
                  name="contractExpiry"
                  type="date"
                  className={fieldClassName}
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

        {success ? (
          <div
            className={`rounded-2xl px-4 py-4 text-sm ${persisted ? "border border-emerald-300/24 bg-emerald-300/10 text-emerald-100" : "border border-amber-300/24 bg-amber-300/10 text-amber-50"}`}
          >
            {success}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <AnimatedButton href={`/portal/${role}/employees`} hint="Back to list" variant="ghost">
            Cancel
          </AnimatedButton>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full border border-cyan-300/24 bg-cyan-300/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50 transition hover:bg-cyan-300/22 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving Employee" : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
