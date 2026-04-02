"use client";

import { Lightbulb, Sparkles } from "lucide-react";

import type { QualitativeInsight } from "@/features/faculty-analytics";

import { QualitativeFeedbackPlaceholderButton } from "./qualitative-feedback-placeholder-button";

type QualitativeInsightGroupProps = {
  title: string;
  accentClassName: string;
  summaryCountLabel: string;
  recommendation: string;
  items: readonly QualitativeInsight[];
};

export function QualitativeInsightGroup({
  title,
  accentClassName,
  summaryCountLabel,
  recommendation,
  items,
}: QualitativeInsightGroupProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <h3
          className={`flex items-center gap-2 font-playfair text-lg font-semibold ${accentClassName}`}
        >
          <Sparkles className="size-4" />
          {title}
        </h3>
        <span className="font-sans text-xs text-muted-foreground">{summaryCountLabel}</span>
      </div>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-lg border border-border/70 bg-background p-3">
            <h4 className="font-sans text-base font-semibold">{item.title}</h4>
            <p className="mt-1 font-sans text-sm text-muted-foreground">{item.description}</p>
            <div className="mt-3 flex items-center gap-3">
              <p className="font-sans text-sm text-muted-foreground">{items.length} mentions</p>
              <QualitativeFeedbackPlaceholderButton />
            </div>
          </div>
        ))}
      </div>
      <div
        className={`mt-4 rounded-lg border p-3 ${accentClassName.includes("emerald") ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/70 dark:bg-emerald-950/20" : "border-orange-200 bg-orange-50/70 dark:border-orange-900/70 dark:bg-orange-950/20"}`}
      >
        <p
          className={`flex items-center gap-2 font-playfair text-sm font-semibold ${accentClassName}`}
        >
          <Lightbulb className="size-4" />
          Recommendations
        </p>
        <p className="mt-2 font-sans text-sm text-muted-foreground">{recommendation}</p>
      </div>
    </div>
  );
}
