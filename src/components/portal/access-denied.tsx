import { ShieldAlert } from "lucide-react";

import { SpotlightPanel } from "@/components/ui/spotlight-panel";

type AccessDeniedProps = {
  title: string;
  message: string;
};

export function AccessDenied({ title, message }: AccessDeniedProps) {
  return (
    <SpotlightPanel className="p-8">
      <div className="flex flex-col gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-300/10 text-rose-100">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-3xl text-white">{title}</h2>
          <p className="max-w-xl text-sm leading-7 text-slate-300">{message}</p>
        </div>
      </div>
    </SpotlightPanel>
  );
}
