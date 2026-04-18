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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLatestPipelineForScope } from "@/features/faculty-analytics/hooks/use-latest-pipeline-for-scope";
import { usePipelineRecommendations } from "@/features/faculty-analytics/hooks/use-pipeline-recommendations";
import { usePipelineStatus } from "@/features/faculty-analytics/hooks/use-pipeline-status";
import {
  aggregateThemes,
  type RankedTheme,
} from "@/features/faculty-analytics/lib/pipeline-themes";
import type { QualitativeThemeDto } from "@/features/faculty-analytics/types";
import { useScopedAnalyticsDashboardViewModel } from "@/features/faculty-analytics/hooks/use-scoped-analytics-dashboard-view-model";

function rankedThemesToQualitativeThemes(themes: RankedTheme[]): QualitativeThemeDto[] {
  return themes.map((theme, index) => {
    const total = theme.commentCount || 0;
    return {
      themeId: `ranked-${index}-${theme.topicLabel}`,
      label: theme.topicLabel,
      count: total,
      sentimentSplit: {
        positive: Math.round(theme.sentimentBreakdown.positive * total),
        neutral: Math.round(theme.sentimentBreakdown.neutral * total),
        negative: Math.round(theme.sentimentBreakdown.negative * total),
      },
      sampleQuotes: theme.sampleQuotes,
    };
  });
}

export type ScopeLabel = "Campus" | "Department" | "Program";

const SCOPE_METADATA: Record<
  ScopeLabel,
  {
    scopeLower: string;
    facultiesHref: string;
  }
> = {
  Campus: {
    scopeLower: "campus",
    facultiesHref: "/campus-head/faculties",
  },
  Department: {
    scopeLower: "department",
    facultiesHref: "/dean/faculties",
  },
  Program: {
    scopeLower: "program",
    facultiesHref: "/chairperson/faculties",
  },
};

function EmptyThemesPlaceholder() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Top Themes</CardTitle>
        <CardDescription>Ranked by comment volume with sentiment breakdown.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 text-center">
          <p className="max-w-sm font-sans text-sm text-muted-foreground">
            Run analysis to surface the strongest feedback themes for this scope.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyRecommendationsPlaceholder() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Suggested Actions</CardTitle>
        <CardDescription>Concrete actions informed by the feedback themes above.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 text-center">
          <p className="max-w-sm font-sans text-sm text-muted-foreground">
            Suggested actions will appear here after a completed analysis run.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScopedAnalyticsDashboardScreen({ scopeLabel }: { scopeLabel: ScopeLabel }) {
  const isCampusScope = scopeLabel === "Campus";
  const showPipelineTrigger = scopeLabel === "Department";
  const {
    departments,
    selectedDepartmentId,
    selectedDepartmentLabel,
    setSelectedDepartmentId,
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
  } = useScopedAnalyticsDashboardViewModel(scopeLabel);
  const pipelineQuery = useMemo(
    () => ({ semesterId: selectedSemesterId ?? "" }),
    [selectedSemesterId]
  );
  const { latestPipeline } = useLatestPipelineForScope(pipelineQuery, {
    enabled: !isCampusScope && Boolean(selectedSemesterId),
  });
  const pipelineStatusQuery = usePipelineStatus(latestPipeline?.id ?? null, {
    enabled: !isCampusScope && Boolean(latestPipeline?.id),
  });
  const liveStatus = isCampusScope
    ? undefined
    : (pipelineStatusQuery.data?.status ?? latestPipeline?.status);
  const recommendationsQuery = usePipelineRecommendations(
    isCampusScope ? null : (latestPipeline?.id ?? null),
    liveStatus
  );
  const themes = useMemo(
    () =>
      recommendationsQuery.data
        ? rankedThemesToQualitativeThemes(aggregateThemes(recommendationsQuery.data.actions))
        : [],
    [recommendationsQuery.data]
  );
  const showRecommendationPanels =
    !isCampusScope && liveStatus === "COMPLETED" && themes.length > 0;
  const showEmptyInsightsPlaceholder =
    !isCampusScope && Boolean(selectedSemesterId) && !showRecommendationPanels;

  const { scopeLower, facultiesHref } = SCOPE_METADATA[scopeLabel];
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
          departments={departments}
          selectedDepartmentId={selectedDepartmentId}
          selectedDepartmentLabel={selectedDepartmentLabel}
          onDepartmentChange={setSelectedDepartmentId}
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

        {showPipelineTrigger && selectedSemesterId ? (
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

            <div
              className={
                isCampusScope
                  ? "grid gap-6"
                  : "grid gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              }
            >
              <ScopedOverallSentimentBarChart overallSentiment={overallSentiment} />
              {isCampusScope ? null : showRecommendationPanels ? (
                <ThemesRankedList themes={themes} />
              ) : showEmptyInsightsPlaceholder ? (
                <EmptyThemesPlaceholder />
              ) : null}
            </div>

            {isCampusScope ? null : (
              <div className="grid gap-6 min-[900px]:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
                <ScopedAttentionCard
                  items={attentionItems}
                  isLoading={isAttentionLoading}
                  hasAnalyticsData={overview?.lastRefreshedAt !== null}
                  scopeLabel={scopeLabel}
                  facultiesHref={facultiesHref}
                  semesterId={selectedSemesterId ?? ""}
                  semesterLabel={selectedSemesterLabel}
                />
                {showRecommendationPanels && recommendationsQuery.data ? (
                  <RecommendationsCard recommendations={recommendationsQuery.data} />
                ) : showEmptyInsightsPlaceholder ? (
                  <EmptyRecommendationsPlaceholder />
                ) : null}
              </div>
            )}
          </>
        )}
      </section>
    </ScopedAnalyticsAsyncContent>
  );
}
