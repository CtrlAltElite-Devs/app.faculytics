"use client";

import { useMemo } from "react";

import { ScopedDashboardHeader } from "@/features/faculty-analytics/components/scoped-dashboard-header";
import { ScopedAttentionCard } from "@/features/faculty-analytics/components/scoped-attention-card";
import { ScopedOverallSentimentBarChart } from "@/features/faculty-analytics/components/scoped-charts";
import { ScopedAnalyticsAsyncContent } from "@/features/faculty-analytics/components/scoped-analytics-async-content";
import { ScopedMetricsGrid } from "@/features/faculty-analytics/components/scoped-metrics-grid";
import { PipelineTriggerCard } from "@/features/faculty-analytics/components/pipeline-trigger-card";
import { RecommendationsCard } from "@/features/faculty-analytics/components/recommendations-card";
import { ThemesRankedList } from "@/features/faculty-analytics/components/themes-ranked-list";
import { useLatestPipelineForScope } from "@/features/faculty-analytics/hooks/use-latest-pipeline-for-scope";
import { usePipelineRecommendations } from "@/features/faculty-analytics/hooks/use-pipeline-recommendations";
import { usePipelineStatus } from "@/features/faculty-analytics/hooks/use-pipeline-status";
import { aggregateThemes } from "@/features/faculty-analytics/lib/pipeline-themes";
import { useScopedAnalyticsDashboardViewModel } from "@/features/faculty-analytics/hooks/use-scoped-analytics-dashboard-view-model";

export type ScopeLabel = "Campus" | "Department";

export function ScopedAnalyticsDashboardScreen({ scopeLabel }: { scopeLabel: ScopeLabel }) {
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
  } = useScopedAnalyticsDashboardViewModel();

  // No departmentId needed — the backend fills the DEAN/CAMPUS_HEAD's
  // resolved scope per FAC-132 TD-2 List rules.
  const pipelineQuery = useMemo(
    () => ({ semesterId: selectedSemesterId ?? "" }),
    [selectedSemesterId]
  );
  const { latestPipeline } = useLatestPipelineForScope(pipelineQuery, {
    enabled: Boolean(selectedSemesterId),
  });
  // Poll status at the screen level so themes/recs gating reacts to the
  // live terminal transition — without this, `latestPipeline.status` comes
  // from the stale list cache and the completed-state UI doesn't appear
  // until the next list refetch or page reload.
  const pipelineStatusQuery = usePipelineStatus(latestPipeline?.id ?? null, {
    enabled: Boolean(latestPipeline?.id),
  });
  const liveStatus = pipelineStatusQuery.data?.status ?? latestPipeline?.status;
  const recommendationsQuery = usePipelineRecommendations(latestPipeline?.id ?? null, liveStatus);
  const themes = useMemo(
    () => (recommendationsQuery.data ? aggregateThemes(recommendationsQuery.data.actions) : []),
    [recommendationsQuery.data]
  );

  const scopeLower = scopeLabel.toLowerCase();
  const facultiesHref = scopeLabel === "Campus" ? "/campus-head/faculties" : "/dean/faculties";
  const emptyStateDescription =
    semesters.length === 0
      ? "Semester options will appear here once academic terms are available."
      : `No analyzed faculty data is available for the selected semester yet.`;

  return (
    <ScopedAnalyticsAsyncContent
      isLoading={isLoading}
      isError={isError}
      onRetry={retry}
      loadingMessage={`Loading ${scopeLower} analytics...`}
      errorMessage={`Unable to load the ${scopeLower} analytics overview.`}
    >
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <ScopedDashboardHeader
          scopeLabel={scopeLabel}
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

        {selectedSemesterId ? (
          <PipelineTriggerCard
            scope={{ semesterId: selectedSemesterId }}
            pipeline={latestPipeline}
          />
        ) : null}

        {semesters.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
            <p className="max-w-xl font-sans text-sm text-muted-foreground">
              {emptyStateDescription}
            </p>
          </div>
        ) : (
          <>
            <ScopedMetricsGrid summary={summary} />

            <div className="grid gap-6 min-[900px]:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
              <ScopedOverallSentimentBarChart overallSentiment={overallSentiment} />
              <ScopedAttentionCard
                items={attentionItems}
                isLoading={isAttentionLoading}
                hasAnalyticsData={overview?.lastRefreshedAt !== null}
                scopeLabel={scopeLabel}
                facultiesHref={facultiesHref}
              />
            </div>

            {liveStatus === "COMPLETED" && themes.length > 0 ? (
              <div className="grid gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <ThemesRankedList themes={themes} />
                {recommendationsQuery.data ? (
                  <RecommendationsCard recommendations={recommendationsQuery.data} />
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </section>
    </ScopedAnalyticsAsyncContent>
  );
}
