"use client";

import { DeanDashboardHeader } from "@/features/faculty-analytics/components/dean-dashboard-header";
import { DeanAttentionCard } from "@/features/faculty-analytics/components/dean-attention-card";
import { DeanOverallSentimentBarChart } from "@/features/faculty-analytics/components/dean-charts";
import { DeanAnalyticsAsyncContent } from "@/features/faculty-analytics/components/dean-analytics-async-content";
import { DeanMetricsGrid } from "@/features/faculty-analytics/components/dean-metrics-grid";
import { useDeanDashboardViewModel } from "@/features/faculty-analytics/hooks/use-dean-dashboard-view-model";

export function DeanDashboardScreen() {
  const {
    semesters,
    programs,
    selectedSemesterId,
    setSelectedSemesterId,
    selectedSemesterLabel,
    selectedProgramCode,
    setSelectedProgramCode,
    selectedProgramLabel,
    lastUpdatedLabel,
    summary,
    overallSentiment,
    attentionItems,
    overview,
    isLoading,
    isAttentionLoading,
    isError,
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
          programs={programs}
          selectedSemesterId={selectedSemesterId}
          selectedSemesterLabel={selectedSemesterLabel}
          onSemesterChange={setSelectedSemesterId}
          selectedProgramCode={selectedProgramCode}
          selectedProgramLabel={selectedProgramLabel}
          onProgramChange={setSelectedProgramCode}
          lastUpdatedLabel={lastUpdatedLabel}
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

            <div className="grid gap-6 min-[900px]:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
              <DeanOverallSentimentBarChart overallSentiment={overallSentiment} />
              <DeanAttentionCard
                items={attentionItems}
                isLoading={isAttentionLoading}
                hasAnalyticsData={overview?.lastRefreshedAt !== null}
              />
            </div>
          </>
        )}
      </section>
    </DeanAnalyticsAsyncContent>
  );
}
