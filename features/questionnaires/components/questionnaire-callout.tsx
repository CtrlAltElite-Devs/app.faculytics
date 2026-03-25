import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type QuestionnaireCalloutProps = {
  children: ReactNode;
  variant?: "info" | "success" | "danger";
  className?: string;
};

const CALLOUT_CLASS_NAMES = {
  info: "border-brand-blue/20 bg-brand-blue/5 text-brand-blue",
  success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-700",
  danger: "border-destructive/30 bg-destructive/5 text-destructive",
} as const;

export function QuestionnaireCallout({
  children,
  variant = "info",
  className,
}: QuestionnaireCalloutProps) {
  return (
    <div
      className={cn("rounded-xl border px-4 py-3 text-sm", CALLOUT_CLASS_NAMES[variant], className)}
    >
      {children}
    </div>
  );
}
