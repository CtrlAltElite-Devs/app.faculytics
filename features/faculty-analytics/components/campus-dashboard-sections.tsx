"use client";

import { ScopedOverallSentimentBarChart } from "@/features/faculty-analytics/components/scoped-charts";
import { ScopedMetricsGrid } from "@/features/faculty-analytics/components/scoped-metrics-grid";
import type { DashboardCommonSectionProps } from "@/features/faculty-analytics/components/scoped-dashboard-section-types";

export function CampusDashboardSections({
  summary,
  overallSentiment,
}: Pick<DashboardCommonSectionProps, "summary" | "overallSentiment">) {
  return (
    <>
      <ScopedMetricsGrid summary={summary} />
      <div className="grid gap-6">
        <ScopedOverallSentimentBarChart overallSentiment={overallSentiment} />
      </div>
    </>
  );
}
