import { ArrowRight, Building2, CircleDollarSign, ShieldCheck, UsersRound } from "lucide-react";

import { AnimatedButton } from "@/components/ui/animated-button";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";
import { getPortalHome, roleNames } from "@/lib/data";

const roleList = ["owner", "hr", "manager", "employee"] as const;

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_24%),linear-gradient(180deg,#07101d_0%,#03050a_100%)] px-4 py-6 text-white lg:px-6">
      <div className="glass-grid absolute inset-0 opacity-30" />
      <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-300/15 blur-[130px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1400px] flex-col gap-6">
        <SpotlightPanel className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">
                Internal Enterprise Platform
              </p>
              <h1 className="mt-3 font-heading text-5xl text-slate-50 drop-shadow-[0_0_14px_rgba(255,255,255,0.55)] [text-shadow:0_0_18px_rgba(255,255,255,0.45),0_0_42px_rgba(34,211,238,0.28),0_0_76px_rgba(251,146,60,0.22)] sm:text-6xl">
                Automated Employee Management System
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                unifies people, payroll, projects, and performance in one secure system
              </p>
            </div>
            <AnimatedButton href="/login" hint="Open portal">
              Launch workspace
            </AnimatedButton>
          </div>
        </SpotlightPanel>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
          <SpotlightPanel className="p-8 sm:p-10">
            <h2 className="mt-5 max-w-4xl font-heading text-4xl text-white sm:text-5xl">
              Built to compress the work of 10 HR operations into a single role-aware command
              center.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              Manage departments, create employee cards, track appraisals, control payroll
              visibility, and monitor salary or contract renewals from one premium internal
              workspace.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <AnimatedButton href="/login" hint="Start demo">
                Enter AEMS
              </AnimatedButton>
              <AnimatedButton
                href="/portal/owner/dashboard"
                hint="Owner preview"
                variant="secondary"
              >
                Preview owner view
              </AnimatedButton>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: UsersRound,
                  label: "Employee records",
                  text: "Profiles, cards, achievements, and proof documents stay in one structured place.",
                },
                {
                  icon: CircleDollarSign,
                  label: "Protected payroll",
                  text: "Only HR, Owner, and the individual employee can see payment flows.",
                },
                {
                  icon: ShieldCheck,
                  label: "Role access",
                  text: "Owner, HR, Manager, and Employee views stay sharply separated.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/14 bg-white/9 p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
                      <Icon className="h-5 w-5 text-cyan-100" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{item.label}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </SpotlightPanel>

          <div className="grid gap-6">
            <SpotlightPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Live modules</p>
              <div className="mt-4 grid gap-3">
                {[
                  "Departments and headcount",
                  "Employee cards and records",
                  "Payroll privacy and payouts",
                  "Appraisals, hikes, renewals",
                  "Projects and daily updates",
                  "Reports and watchlists",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-base text-slate-200 sm:text-lg"
                  >
                    <span>{item}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </SpotlightPanel>

            <SpotlightPanel className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Role demos</p>
              <div className="mt-4 space-y-3">
                {roleList.map((role) => (
                  <a
                    key={role}
                    href={getPortalHome(role)}
                    className="flex items-center justify-between rounded-[22px] border border-white/12 bg-white/8 px-4 py-4 transition hover:border-cyan-300/24 hover:bg-cyan-300/12"
                  >
                    <div>
                      <p className="text-base font-bold text-white sm:text-lg">{roleNames[role]}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      {role === "owner" || role === "hr" ? (
                        <Building2 className="h-5 w-5 text-amber-100" />
                      ) : (
                        <UsersRound className="h-5 w-5 text-cyan-100" />
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </SpotlightPanel>
          </div>
        </section>
      </div>
    </main>
  );
}
