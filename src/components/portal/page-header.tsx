import { AnimatedButton } from "@/components/ui/animated-button";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href?: string;
    hint: string;
  };
  centered?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  primaryAction,
  centered = false,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
        centered && "items-center text-center lg:flex-col lg:justify-center",
      )}
    >
      <div className={cn("max-w-3xl space-y-3", centered && "mx-auto")}>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-heading text-3xl text-white sm:text-4xl">{title}</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
      </div>
      {primaryAction ? (
        <AnimatedButton href={primaryAction.href} hint={primaryAction.hint}>
          {primaryAction.label}
        </AnimatedButton>
      ) : null}
    </div>
  );
}
