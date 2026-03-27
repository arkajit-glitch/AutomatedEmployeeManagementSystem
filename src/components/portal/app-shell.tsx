"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, PanelLeftClose, PanelLeftOpen, Search, Sparkles } from "lucide-react";
import { useState } from "react";

import { navItems, Role, roleAccent, roleNames, roleTaglines } from "@/lib/data";
import { cn } from "@/lib/utils";

type AppShellProps = {
  role: Role;
  children: React.ReactNode;
};

export function AppShell({ role, children }: AppShellProps) {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const activeKey =
    navItems.find((item) => pathname.includes(`/${item.key}`))?.key ?? "dashboard";
  const isExpanded = isPinned || isHovered;
  const allowedItems = navItems.filter((item) => item.allowedRoles.includes(role));

  const renderSidebar = (expanded: boolean, showToggle: boolean) => (
    <>
      <div
        className={cn(
          "flex items-start gap-3",
          expanded ? "justify-between" : "flex-col items-center justify-center",
        )}
      >
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-3",
            !expanded && "justify-center",
          )}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
            <Sparkles className="h-5 w-5 text-cyan-100" />
          </div>
          {expanded ? (
            <div>
              <p className="font-heading text-xl text-white">AEMS</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Automated Workforce Hub
              </p>
            </div>
          ) : null}
        </Link>

        {showToggle ? (
          <button
            type="button"
            onClick={() => setIsPinned((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-slate-200 transition hover:bg-white/14"
            aria-label={isPinned ? "Set Sidebar To Auto Collapse" : "Pin Sidebar Open"}
            title={isPinned ? "Set Sidebar To Auto Collapse" : "Pin Sidebar Open"}
          >
            {isPinned ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>
        ) : null}
      </div>

      {expanded ? (
        <div className="mt-8 rounded-[26px] border border-white/12 bg-white/8 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Signed in as</p>
          <h2 className="mt-3 font-heading text-2xl text-white">{roleNames[role]}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">{roleTaglines[role]}</p>
        </div>
      ) : null}

      <nav className={cn("mt-8 space-y-2", !expanded && "flex flex-col items-center")}>
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const label = role === "employee" && item.key === "employees" ? "My Profile" : item.label;
          const hint =
            role === "employee" && item.key === "employees" ? "Personal record" : item.hint;

          return (
            <Link
              key={item.key}
              href={item.href(role)}
              className={cn(
                "group flex items-center rounded-2xl border transition",
                item.key === activeKey
                  ? "border-cyan-300/30 bg-cyan-300/14 text-white"
                  : "border-transparent bg-white/8 text-slate-300 hover:border-white/12 hover:bg-white/12 hover:text-white",
                expanded ? "justify-between px-4 py-3" : "mx-auto w-14 justify-center px-0 py-3",
              )}
              title={label}
            >
              <span
                className={cn(
                  "flex items-center gap-3",
                  !expanded && "w-full justify-center",
                )}
              >
                <span className="rounded-xl border border-white/10 bg-white/5 p-2">
                  <Icon className="h-4 w-4" />
                </span>
                {expanded ? (
                  <span className="min-w-[140px] text-left">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500 group-hover:text-slate-400">
                      {hint}
                    </span>
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </nav>

      {expanded ? (
        <div className="mt-8 rounded-[26px] border border-amber-300/20 bg-amber-200/14 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-100/70">
            Policy reminder
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Payroll and contract actions stay locked to approved roles only. Employee views never
            expose peer compensation.
          </p>
        </div>
      ) : null}
    </>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,#09111f_0%,#04070d_100%)] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">
        <aside className="relative mb-6 overflow-hidden rounded-[32px] border border-white/12 bg-slate-900/78 p-5 backdrop-blur-xl lg:hidden">
          <div
            className={cn(
              "absolute inset-x-6 top-0 h-40 rounded-full bg-gradient-to-b blur-3xl",
              roleAccent[role],
            )}
          />
          <div className="relative z-10">{renderSidebar(true, false)}</div>
        </aside>

        <aside
          className={cn(
            "fixed bottom-4 left-4 top-4 z-30 hidden overflow-hidden rounded-[32px] border border-white/12 bg-slate-900/78 shadow-[0_24px_80px_rgba(2,6,23,0.4)] backdrop-blur-xl transition-[width] duration-300 lg:block",
            isExpanded ? "w-[280px]" : "w-[88px]",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={cn(
              "absolute inset-x-6 top-0 h-40 rounded-full bg-gradient-to-b blur-3xl",
              roleAccent[role],
            )}
          />
          <div className={cn("relative z-10 h-full overflow-y-auto", isExpanded ? "p-6" : "p-4")}>
            {renderSidebar(isExpanded, true)}
          </div>
        </aside>

        <div
          className={cn(
            "space-y-6 transition-[padding] duration-300",
            "lg:pl-[104px]",
            isPinned && "lg:pl-[296px]",
          )}
        >
          <header className="rounded-[30px] border border-white/12 bg-slate-900/78 px-5 py-4 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-300">
                <Search className="h-4 w-4" />
                Search employees, departments, renewals, or projects
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-200">
                  Friday sync - 27 Mar 2026
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-slate-100">
                  <Bell className="h-4 w-4" />
                </div>
              </div>
            </div>
          </header>

          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
