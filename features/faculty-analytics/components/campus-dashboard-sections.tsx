"use client";

import { ScopedOverallSentimentBarChart } from "@/features/faculty-analytics/components/scoped-charts";
import { ScopedFacultyRankings } from "@/features/faculty-analytics/components/scoped-faculty-rankings";
import { ScopedMetricsGrid } from "@/features/faculty-analytics/components/scoped-metrics-grid";
import type { DashboardCommonSectionProps } from "@/features/faculty-analytics/components/scoped-dashboard-section-types";

export function CampusDashboardSections({
  summary,
  overallSentiment,
  facultyRankings,
  scopeLabel,
  selectedSemesterId,
  selectedSemesterLabel,
}: Pick<
  DashboardCommonSectionProps,
  | "summary"
  | "overallSentiment"
  | "facultyRankings"
  | "scopeLabel"
  | "selectedSemesterId"
  | "selectedSemesterLabel"
>) {
  return (
    <>
      <ScopedMetricsGrid summary={summary} />
      <div className="grid gap-6">
        <ScopedOverallSentimentBarChart overallSentiment={overallSentiment} />
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
