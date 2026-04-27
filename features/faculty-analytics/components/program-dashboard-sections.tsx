"use client";

import { ScopedAttentionCard } from "@/features/faculty-analytics/components/scoped-attention-card";
import { ScopedOverallSentimentBarChart } from "@/features/faculty-analytics/components/scoped-charts";
import { ScopedFacultyRankings } from "@/features/faculty-analytics/components/scoped-faculty-rankings";
import { ScopedMetricsGrid } from "@/features/faculty-analytics/components/scoped-metrics-grid";
import type { DashboardCommonSectionProps } from "@/features/faculty-analytics/components/scoped-dashboard-section-types";

export function ProgramDashboardSections({
  summary,
  overallSentiment,
  attentionItems,
  facultyRankings,
  isAttentionLoading,
  hasAnalyticsData,
  scopeLabel,
  facultiesHref,
  selectedSemesterId,
  selectedSemesterLabel,
}: DashboardCommonSectionProps) {
  return (
    <>
      <ScopedMetricsGrid summary={summary} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <ScopedOverallSentimentBarChart overallSentiment={overallSentiment} />
        <ScopedAttentionCard
          items={attentionItems}
          isLoading={isAttentionLoading}
          hasAnalyticsData={hasAnalyticsData}
          scopeLabel={scopeLabel}
          facultiesHref={facultiesHref}
          semesterId={selectedSemesterId ?? ""}
          semesterLabel={selectedSemesterLabel}
        />
      </div>

      <ScopedFacultyRankings
        facultyRankings={facultyRankings}
        scopeLabel={scopeLabel}
        selectedSemesterId={selectedSemesterId}
        selectedSemesterLabel={selectedSemesterLabel}
      />
    </>
  );
}
