"use client";

import { DeanDashboardHeader } from "@/features/faculty-analytics/components/dean-dashboard-header";
import { DeanOverallSentimentBarChart } from "@/features/faculty-analytics/components/dean-charts";
import { DeanAnalyticsAsyncContent } from "@/features/faculty-analytics/components/dean-analytics-async-content";
import { DeanKeyThemesCard } from "@/features/faculty-analytics/components/dean-key-themes-card";
import { DeanMetricsGrid } from "@/features/faculty-analytics/components/dean-metrics-grid";
import { useDeanDashboardViewModel } from "@/features/faculty-analytics/hooks/use-dean-dashboard-view-model";

export function DeanDashboardScreen() {
  const {
    semesters,
    selectedSemesterId,
    setSelectedSemesterId,
    selectedSemesterLabel,
    lastUpdatedLabel,
    summary,
    overallSentiment,
    keyThemes,
    overview,
    isLoading,
    isRefreshing,
    isError,
    refresh,
    retry,
  } = useDeanDashboardViewModel();

  const emptyStateDescription =
    semesters.length === 0
      ? "Semester options will appear here once academic terms are available."
      : "Analytics data has not been refreshed yet for the selected semester.";
  const shouldShowInlineNotice = semesters.length > 0 && overview?.lastRefreshedAt === null;

  return (
    <DeanAnalyticsAsyncContent
      isLoading={isLoading}
      isError={isError}
      onRetry={retry}
      loadingMessage="Loading department analytics..."
      errorMessage="Unable to load the department analytics overview."
    >
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <DeanDashboardHeader
          semesters={semesters}
          selectedSemesterId={selectedSemesterId}
          selectedSemesterLabel={selectedSemesterLabel}
          onSemesterChange={setSelectedSemesterId}
          lastUpdatedLabel={lastUpdatedLabel}
          isRefreshing={isRefreshing}
          onRefresh={refresh}
        />

        {semesters.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
            <p className="max-w-xl font-sans text-sm text-muted-foreground">
              {emptyStateDescription}
            </p>
          </div>
        ) : (
          <>
            {shouldShowInlineNotice ? (
              <div className="rounded-lg border border-dashed px-4 py-3">
                <p className="font-sans text-sm text-muted-foreground">{emptyStateDescription}</p>
              </div>
            ) : null}

            <DeanMetricsGrid summary={summary} />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <DeanOverallSentimentBarChart overallSentiment={overallSentiment} />
              <DeanKeyThemesCard themes={keyThemes} />
            </div>
          </>
        )}
      </section>
    </DeanAnalyticsAsyncContent>
  );
}
