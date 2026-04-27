"use client";

import { useMemo } from "react";

import { CampusDashboardSections } from "@/features/faculty-analytics/components/campus-dashboard-sections";
import { DepartmentDashboardSections } from "@/features/faculty-analytics/components/department-dashboard-sections";
import { ProgramDashboardSections } from "@/features/faculty-analytics/components/program-dashboard-sections";
import { ScopedDashboardHeader } from "@/features/faculty-analytics/components/scoped-dashboard-header";
import { ScopedAnalyticsAsyncContent } from "@/features/faculty-analytics/components/scoped-analytics-async-content";
import type {
  DashboardCommonSectionProps,
  ScopeLabel,
} from "@/features/faculty-analytics/components/scoped-dashboard-section-types";
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

const SCOPE_METADATA: Record<
  ScopeLabel,
  {
    scopeLower: string;
    facultiesHref: string;
  }
> = {
  Campus: {
    scopeLower: "campus",
    facultiesHref: "/campus-head/faculty",
  },
  Department: {
    scopeLower: "department",
    facultiesHref: "/dean/faculty",
  },
  Program: {
    scopeLower: "program",
    facultiesHref: "/chairperson/faculty",
  },
};

export function ScopedAnalyticsDashboardScreen({ scopeLabel }: { scopeLabel: ScopeLabel }) {
  const isCampusScope = scopeLabel === "Campus";
  const isProgramScope = scopeLabel === "Program";
  const supportsAggregatePipeline = scopeLabel === "Department";
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
    enabled: supportsAggregatePipeline && Boolean(selectedSemesterId),
  });
  const pipelineStatusQuery = usePipelineStatus(latestPipeline?.id ?? null, {
    enabled: supportsAggregatePipeline && Boolean(latestPipeline?.id),
  });
  const liveStatus = !supportsAggregatePipeline
    ? undefined
    : (pipelineStatusQuery.data?.status ?? latestPipeline?.status);
  const recommendationsQuery = usePipelineRecommendations(
    supportsAggregatePipeline ? (latestPipeline?.id ?? null) : null,
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
    supportsAggregatePipeline && liveStatus === "COMPLETED" && themes.length > 0;
  const showEmptyInsightsPlaceholder =
    supportsAggregatePipeline && Boolean(selectedSemesterId) && !showRecommendationPanels;

  const { scopeLower, facultiesHref } = SCOPE_METADATA[scopeLabel];
  const emptyStateDescription =
    semesters.length === 0
      ? "Semester options will appear here once academic terms are available."
      : `No analyzed faculty data is available for the selected semester yet.`;
  const hasAnalyticsData = overview?.lastRefreshedAt !== null;
  const commonSectionProps: DashboardCommonSectionProps = {
    summary,
    overallSentiment,
    attentionItems,
    isAttentionLoading,
    hasAnalyticsData,
    scopeLabel,
    facultiesHref,
    selectedSemesterId,
    selectedSemesterLabel,
  };

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

        {semesters.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
            <p className="max-w-xl font-sans text-sm text-muted-foreground">
              {emptyStateDescription}
            </p>
          </div>
        ) : isProgramScope ? (
          <ProgramDashboardSections {...commonSectionProps} />
        ) : isCampusScope ? (
          <CampusDashboardSections summary={summary} overallSentiment={overallSentiment} />
        ) : (
          <DepartmentDashboardSections
            {...commonSectionProps}
            latestPipeline={latestPipeline}
            showPipelineTrigger={supportsAggregatePipeline}
            themes={themes}
            showRecommendationPanels={showRecommendationPanels}
            showEmptyInsightsPlaceholder={showEmptyInsightsPlaceholder}
            recommendations={recommendationsQuery.data}
          />
        )}
      </section>
    </ScopedAnalyticsAsyncContent>
  );
}
