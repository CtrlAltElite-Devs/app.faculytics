"use client";

import { DeanDashboardHeader } from "@/features/faculty-analytics/components/dean-dashboard-header";
import {
  DeanOverallSentimentPieChart,
  DeanSentimentBarChart,
} from "@/features/faculty-analytics/components/dean-charts";
import { DeanAnalyticsAsyncContent } from "@/features/faculty-analytics/components/dean-analytics-async-content";
import { DeanMetricsGrid } from "@/features/faculty-analytics/components/dean-metrics-grid";
import { useDeanDashboardViewModel } from "@/features/faculty-analytics/hooks/use-dean-dashboard-view-model";

export function DeanDashboardScreen() {
  const {
    academicYears,
    selectedAcademicYear,
    setSelectedAcademicYear,
    lastUpdated,
    summary,
    overallSentiment,
    semesterSentiment,
    isLoading,
    isError,
    retry,
  } = useDeanDashboardViewModel();

  const emptyState =
    summary.faculties === 0
      ? {
          description:
            "Analytics overview will appear here once faculty evaluation data is available.",
        }
      : null;

  return (
    <DeanAnalyticsAsyncContent
      isLoading={isLoading}
      isError={isError}
      onRetry={retry}
      loadingMessage="Loading department analytics..."
      errorMessage="Unable to load the department analytics overview."
      emptyState={emptyState}
    >
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <DeanDashboardHeader
          academicYears={academicYears}
          selectedAcademicYear={selectedAcademicYear}
          onAcademicYearChange={setSelectedAcademicYear}
          lastUpdated={lastUpdated}
        />
        <DeanMetricsGrid summary={summary} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <DeanSentimentBarChart semesterSentiment={semesterSentiment} />
          <DeanOverallSentimentPieChart overallSentiment={overallSentiment} />
        </div>
      </section>
    </DeanAnalyticsAsyncContent>
  );
}
