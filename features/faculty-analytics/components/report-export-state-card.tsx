"use client";

import { Badge } from "@/components/ui/badge";

type ReportExportStateTone = "success" | "warning" | "error" | "neutral";

type ReportExportStateCardProps = {
  title: string;
  message: string;
  badgeLabel?: string;
  tone: ReportExportStateTone;
  meta?: string;
  centered?: boolean;
};

const TONE_STYLES: Record<ReportExportStateTone, string> = {
  success: "border-emerald-500/30 bg-emerald-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  error: "border-destructive/30 bg-destructive/5",
  neutral: "border-border/70 bg-muted/20",
};

const BADGE_STYLES: Record<ReportExportStateTone, string> = {
  success: "border-emerald-500/30 text-emerald-700",
  warning: "border-amber-500/30 text-amber-700",
  error: "border-destructive/30 text-destructive",
  neutral: "border-border/70 text-foreground",
};

export function ReportExportStateCard({
  title,
  message,
  badgeLabel,
  tone,
  meta,
  centered = false,
}: ReportExportStateCardProps) {
  return (
    <div className={`space-y-2 rounded-lg border px-4 py-5 ${TONE_STYLES[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans text-sm font-medium text-foreground">{title}</p>
        {badgeLabel ? (
          <Badge variant="outline" className={BADGE_STYLES[tone]}>
            {badgeLabel}
          </Badge>
        ) : null}
      </div>
      <p className={`font-sans text-sm text-muted-foreground ${centered ? "text-center" : ""}`}>
        {message}
      </p>
      {meta ? <p className="font-sans text-xs text-muted-foreground">{meta}</p> : null}
    </div>
  );
}
