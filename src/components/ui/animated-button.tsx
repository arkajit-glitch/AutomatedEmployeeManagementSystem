"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

type AnimatedButtonProps = {
  href?: string;
  children: React.ReactNode;
  hint: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function AnimatedButton({
  href,
  children,
  hint,
  className,
  variant = "primary",
}: AnimatedButtonProps) {
  const [position, setPosition] = useState({ x: "50%", y: "50%" });
  const tooltipId = useId();

  const styles = {
    "--spot-x": position.x,
    "--spot-y": position.y,
  } as React.CSSProperties;

  const classes = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full border px-5 py-3 text-sm font-semibold tracking-[0.18em] uppercase transition duration-300",
    "before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_var(--spot-x)_var(--spot-y),rgba(255,255,255,0.28),transparent_38%)] before:opacity-0 before:transition before:duration-300 hover:before:opacity-100",
    "after:absolute after:inset-0 after:rounded-full after:p-[1px] after:content-['']",
    variant === "primary" &&
      "border-white/20 bg-white/10 text-white shadow-[0_18px_70px_rgba(6,182,212,0.22)] after:bg-[linear-gradient(115deg,rgba(250,204,21,0.9),rgba(34,211,238,0.88),rgba(16,185,129,0.8))]",
    variant === "secondary" &&
      "border-cyan-200/20 bg-slate-950/40 text-cyan-50 after:bg-[linear-gradient(115deg,rgba(34,211,238,0.95),rgba(103,232,249,0.4),rgba(255,255,255,0.2))]",
    variant === "ghost" &&
      "border-white/12 bg-white/5 text-slate-100 after:bg-[linear-gradient(115deg,rgba(255,255,255,0.75),rgba(255,255,255,0.12),rgba(255,255,255,0.65))]",
    className,
  );

  const content = (
    <span
      aria-describedby={tooltipId}
      className={classes}
      onMouseMove={(event) => {
        const target = event.currentTarget.getBoundingClientRect();
        setPosition({
          x: `${event.clientX - target.left}px`,
          y: `${event.clientY - target.top}px`,
        });
      }}
      style={styles}
    >
      <span className="absolute inset-[1px] rounded-full bg-slate-950/85" />
      <span className="relative z-10">{children}</span>
      <span
        id={tooltipId}
        className="pointer-events-none absolute -bottom-10 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/12 bg-slate-950/95 px-3 py-1 text-[10px] font-medium tracking-[0.18em] text-slate-300 opacity-0 transition duration-200 group-hover:opacity-100"
      >
        {hint}
      </span>
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
