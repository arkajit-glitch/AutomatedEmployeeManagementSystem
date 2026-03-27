import Link from "next/link";

import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { StatusPill } from "@/components/ui/status-pill";
import { EmployeeRecord, Role, roleNames } from "@/lib/data";

type EmployeeCardProps = {
  employee: EmployeeRecord;
  role: Role;
};

export function EmployeeCard({ employee, role }: EmployeeCardProps) {
  return (
    <SpotlightPanel className="h-full p-6">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/14 text-lg font-semibold text-white">
              {employee.avatar}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-white">{employee.name}</h3>
                <StatusPill
                  tone={
                    employee.status === "Active"
                      ? "positive"
                      : employee.status === "Probation"
                        ? "warning"
                        : "critical"
                  }
                >
                  {employee.status}
                </StatusPill>
              </div>
              <p className="text-sm text-slate-300">
                {employee.role} • {employee.department}
              </p>
            </div>
          </div>

          {role !== "employee" ? (
            <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.16em] text-slate-300">
              {employee.id}
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[26px] border border-cyan-300/12 bg-[linear-gradient(145deg,rgba(34,211,238,0.12),rgba(15,23,42,0.45))] p-5 text-left">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Current Project</p>
            <h4 className="mt-3 text-2xl font-semibold text-white">{employee.project}</h4>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Manager</p>
                <p className="mt-2 text-sm text-slate-100">{employee.manager}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Access Role</p>
                <p className="mt-2 text-sm text-slate-100">{roleNames[employee.accessRole]}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-left">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Work Email</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                {employee.email}
              </p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-left">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Phone</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                {employee.phone}
              </p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-left">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Location</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">{employee.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/8 pt-5">
          <Link
            href={`/portal/${role}/employees/${employee.id}`}
            className="inline-flex rounded-full border border-cyan-300/24 bg-cyan-300/14 px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-cyan-50 transition hover:bg-cyan-300/22"
          >
            View Profile
          </Link>
        </div>
      </div>
    </SpotlightPanel>
  );
}
