"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type SpotlightPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SpotlightPanel({ children, className }: SpotlightPanelProps) {
  const [position, setPosition] = useState({ x: "50%", y: "50%" });

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/14 bg-slate-900/80 backdrop-blur-xl",
        "before:absolute before:-inset-px before:bg-[radial-gradient(circle_at_var(--spot-x)_var(--spot-y),rgba(34,211,238,0.22),transparent_35%)] before:opacity-0 before:transition before:duration-300 hover:before:opacity-100",
        className,
      )}
      onMouseMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        setPosition({
          x: `${event.clientX - box.left}px`,
          y: `${event.clientY - box.top}px`,
        });
      }}
      style={
        {
          "--spot-x": position.x,
          "--spot-y": position.y,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_30%,rgba(255,255,255,0.04))]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
