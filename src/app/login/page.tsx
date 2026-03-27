import { LockKeyhole, UserCircle2 } from "lucide-react";

import { AnimatedButton } from "@/components/ui/animated-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { getPortalHome, roleNames } from "@/lib/data";

const demoRoles = ["owner", "hr", "manager", "employee"] as const;

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_20%),linear-gradient(180deg,#07101d_0%,#03050a_100%)] px-4 py-10 text-white lg:px-6">
      <div className="mx-auto grid max-w-[1280px] gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SpotlightPanel className="p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-100/70">
            Secure role-based access
          </p>
          <h1 className="mt-4 font-heading text-4xl text-white">Welcome back to AEMS.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
            This demo uses role launch links so we can move straight into the real screens while
            the backend auth layer is still being wired up.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/12 bg-white/8 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
                <UserCircle2 className="h-5 w-5 text-cyan-100" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">Unified profiles</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                One employee record carries documents, achievements, appraisal results, hikes, and
                contract renewal history.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/12 bg-white/8 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
                <LockKeyhole className="h-5 w-5 text-amber-100" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">Restricted payroll</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Compensation details stay private between HR, Owner, and the employee whose record
                is being viewed.
              </p>
            </div>
          </div>
        </SpotlightPanel>

        <SpotlightPanel className="p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Demo access</p>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">
                Email or employee ID
              </span>
              <input
                readOnly
                value="Use the role launch buttons below"
                className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-slate-200 outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">
                Password
              </span>
              <input
                readOnly
                value="Backend auth coming next"
                className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-slate-200 outline-none"
              />
            </label>
          </div>

          <div className="mt-8 grid gap-3">
            {demoRoles.map((role) => (
              <AnimatedButton
                key={role}
                href={getPortalHome(role)}
                hint={`Open ${roleNames[role]}`}
                variant={role === "owner" ? "primary" : "secondary"}
                className="w-full"
              >
                Continue as {roleNames[role]}
              </AnimatedButton>
            ))}
          </div>
        </SpotlightPanel>
      </div>
    </main>
  );
}
