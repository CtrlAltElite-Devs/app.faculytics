"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FacultyAnalysisSentimentStrip } from "@/features/faculty-analytics/components/faculty-analysis-sentiment-strip";
import { FacultyAnalysisStats } from "@/features/faculty-analytics/components/faculty-analysis-stats";
import { FacultyReportComments } from "@/features/faculty-analytics/components/faculty-report-comments";
import { PipelineTriggerCard } from "@/features/faculty-analytics/components/pipeline-trigger-card";
import { QuantitativeScoresSection } from "@/features/faculty-analytics/components/quantitative-scores-section";
import { RecommendationsCard } from "@/features/faculty-analytics/components/recommendations-card";
import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import { ScopedAnalyticsErrorState } from "@/features/faculty-analytics/components/scoped-analytics-error-state";
import { ScopedAnalyticsLoadingState } from "@/features/faculty-analytics/components/scoped-analytics-loading-state";
import { ReportExportDialog } from "@/features/faculty-analytics/components/report-export-dialog";
import { ThemeExplorerList } from "@/features/faculty-analytics/components/theme-explorer-list";
import { useFacultyReportDetailViewModel } from "@/features/faculty-analytics/hooks/use-faculty-report-detail-view-model";
import { useLatestPipelineForScope } from "@/features/faculty-analytics/hooks/use-latest-pipeline-for-scope";
import { usePipelineRecommendations } from "@/features/faculty-analytics/hooks/use-pipeline-recommendations";
import { usePipelineStatus } from "@/features/faculty-analytics/hooks/use-pipeline-status";
import { hasFacultyReportAnalyticsData } from "@/features/faculty-analytics/lib/faculty-report-detail";
import {
  deriveThemeFacets,
  filterThemesByFacet,
} from "@/features/faculty-analytics/lib/facet-filter";
import type { PipelineStatus } from "@/features/faculty-analytics/types";

import { FacultyReportHeader } from "./faculty-report-header";

type FacultyReportScreenProps = {
  facultyId: string;
};

const SENTIMENT_READY_STATUSES: ReadonlySet<PipelineStatus> = new Set<PipelineStatus>([
  "SENTIMENT_GATE",
  "TOPIC_MODELING",
  "GENERATING_RECOMMENDATIONS",
  "COMPLETED",
]);

export function FacultyReportScreen({ facultyId }: FacultyReportScreenProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const viewModel = useFacultyReportDetailViewModel({ facultyId });

  // FAC-135 Phase C (Task C2/C5): canonical scope shape is {scopeType, scopeId}
  // plus semesterId. Faculty report always scopes to a single faculty.
  const pipelineScope = useMemo(
    () => ({
      semesterId: viewModel.semesterId ?? "",
      scopeType: "FACULTY" as const,
      scopeId: facultyId,
    }),
    [viewModel.semesterId, facultyId]
  );
  const { latestPipeline } = useLatestPipelineForScope(pipelineScope, {
    enabled: Boolean(viewModel.semesterId),
  });
  const pipelineStatusQuery = usePipelineStatus(latestPipeline?.id ?? null, {
    enabled: Boolean(latestPipeline?.id),
  });
  const livePipelineStatus = pipelineStatusQuery.data?.status ?? latestPipeline?.status;
  const recommendationsQuery = usePipelineRecommendations(
    latestPipeline?.id ?? null,
    livePipelineStatus
  );

  const qualitativeSummary = viewModel.qualitativeSummaryQuery.data;
  const themes = useMemo(() => qualitativeSummary?.themes ?? [], [qualitativeSummary?.themes]);
  const actions = useMemo(
    () => recommendationsQuery.data?.actions ?? [],
    [recommendationsQuery.data?.actions]
  );

  // FAC-135 Phase C: voiceBreakdown drives facet badge counts + empty-state
  // discrimination. Pull from the status poll (freshest) with fallback.
  const voiceBreakdown =
    pipelineStatusQuery.data?.coverage.voiceBreakdown ??
    latestPipeline?.coverage.voiceBreakdown ??
    null;

  // Client-side theme -> facet derivation via topic-label join.
  const themeFacets = useMemo(() => deriveThemeFacets(themes, actions), [themes, actions]);
  const visibleThemes = useMemo(
    () => filterThemesByFacet(themes, themeFacets, viewModel.selectedFacet),
    [themes, themeFacets, viewModel.selectedFacet]
  );

  const showSentimentSurface = livePipelineStatus
    ? SENTIMENT_READY_STATUSES.has(livePipelineStatus)
    : false;
  const showThemesSurface = livePipelineStatus === "COMPLETED";

  const announcement = useMemo(() => {
    const parts: string[] = [];
    if (viewModel.themeLabelFilter) parts.push(viewModel.themeLabelFilter);
    if (viewModel.sentimentFilter) {
      parts.push(
        viewModel.sentimentFilter.charAt(0).toUpperCase() + viewModel.sentimentFilter.slice(1)
      );
    }
    if (parts.length === 0) return "";
    const total = viewModel.commentsMeta?.totalItems ?? 0;
    return `Filter applied: ${parts.join(", ")}. ${total} comment${total === 1 ? "" : "s"} shown.`;
  }, [viewModel.themeLabelFilter, viewModel.sentimentFilter, viewModel.commentsMeta?.totalItems]);

  if (!viewModel.hasSemesterContext) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <div className="flex justify-end">
          <Button asChild variant="outline" className="font-sans">
            <Link href={viewModel.backHref}>Back to Faculties</Link>
          </Button>
        </div>
        <ScopedAnalyticsErrorState
          onRetry={viewModel.goBackToFaculties}
          message="Missing semester context. Start from the faculties list to open a faculty report."
        />
      </section>
    );
  }

  if (viewModel.reportQuery.isLoading) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <ScopedAnalyticsLoadingState message="Loading faculty report..." />
      </section>
    );
  }

  if (viewModel.reportQuery.isError || !viewModel.report) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <div className="flex justify-end">
          <Button asChild variant="outline" className="font-sans">
            <Link href={viewModel.backHref}>Back to Faculties</Link>
          </Button>
        </div>
        <ScopedAnalyticsErrorState
          onRetry={viewModel.retryAll}
          message="Unable to load the faculty evaluation report."
        />
      </section>
    );
  }

  const hasAnalyticsData = hasFacultyReportAnalyticsData(viewModel.report, viewModel.commentsCount);

  return (
    <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
      {/* Title row — mirrors the dashboard / faculty-list header pattern */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
            {viewModel.report.faculty.name}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Review per-question faculty evaluation results for{" "}
            <span className="font-medium text-foreground">{viewModel.semesterLabel}</span>.
          </p>
        </div>

        <FacultyReportHeader
          backHref={viewModel.backHref}
          courseId={viewModel.courseId}
          courseLabel={viewModel.selectedCourseLabel}
          availableCourses={viewModel.availableCourses}
          isCourseLoading={viewModel.isCourseLoading}
          onCourseChange={viewModel.updateCourse}
          onExport={() => setIsExportDialogOpen(true)}
          selectedFacet={viewModel.selectedFacet}
          onFacetChange={viewModel.selectFacet}
          voiceBreakdown={voiceBreakdown}
        />
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {!hasAnalyticsData ? (
        <ScopedAnalyticsEmptyState description="No evaluation analytics are available for this faculty in the selected filters." />
      ) : (
        <>
          {/* Analysis pipeline status — surfaced prominently, same pattern as
              dashboard. Not hidden in a collapsible. */}
          {viewModel.semesterId ? (
            <PipelineTriggerCard scope={pipelineScope} pipeline={latestPipeline} />
          ) : null}

          <FacultyAnalysisStats
            submissionCount={viewModel.report.submissionCount}
            overallRating={viewModel.report.overallRating}
            overallInterpretation={viewModel.report.overallInterpretation}
            commentsCount={viewModel.commentsCount}
            sentimentDistribution={
              showSentimentSurface && qualitativeSummary
                ? qualitativeSummary.sentimentDistribution
                : null
            }
          />

          {showSentimentSurface && qualitativeSummary ? (
            <FacultyAnalysisSentimentStrip
              distribution={qualitativeSummary.sentimentDistribution}
              sentimentFilter={viewModel.sentimentFilter}
              themeLabelFilter={viewModel.themeLabelFilter}
              onSentimentClick={viewModel.updateSentimentFilter}
              onClearSentiment={() => viewModel.updateSentimentFilter(null)}
              onClearTheme={() => viewModel.updateThemeFilter(null)}
              onClearAll={viewModel.clearAllFilters}
            />
          ) : null}

          {showThemesSurface && visibleThemes.length > 0 ? (
            <section className="space-y-6">
              {/* FAC-135 Phase C (Task C7): scope-narrowing subtext. */}
              <p className="max-w-3xl text-xs text-muted-foreground">
                Themes and feedback are analyzed across all your courses to ensure reliable
                patterns. Per-course breakdowns show quantitative ratings only.
              </p>
              <ThemeExplorerList
                themes={visibleThemes}
                expandedThemeLabel={viewModel.themeLabelFilter}
                onToggleTheme={viewModel.updateThemeFilter}
                facultyId={facultyId}
                semesterId={viewModel.semesterId}
                questionnaireTypeCode={viewModel.questionnaireTypeCode}
                sentimentFilter={viewModel.sentimentFilter}
                actions={actions}
              />
              {recommendationsQuery.data ? (
                <RecommendationsCard
                  recommendations={recommendationsQuery.data}
                  selectedFacet={viewModel.selectedFacet}
                  voiceBreakdown={voiceBreakdown}
                />
              ) : null}
            </section>
          ) : showThemesSurface && themes.length === 0 && viewModel.comments.length > 0 ? (
            <section>
              <div className="max-w-3xl">
                <h2 className="font-playfair text-xl font-semibold tracking-tight text-foreground">
                  Student comments
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  No themes clustered from this analysis. The raw comments are below.
                </p>
              </div>
              <div className="mt-4">
                <FacultyReportComments
                  comments={viewModel.comments}
                  commentsMeta={viewModel.commentsMeta}
                  commentsPage={viewModel.commentsPage}
                  commentsLimit={viewModel.commentsLimit}
                  isLoading={viewModel.commentsQuery.isLoading}
                  isError={viewModel.commentsQuery.isError}
                  onRetry={viewModel.retryComments}
                  onPageChange={viewModel.updateCommentsPage}
                  onRowsPerPageChange={viewModel.updateCommentsLimit}
                />
              </div>
            </section>
          ) : showSentimentSurface ? (
            <section className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Sentiment analysis is ready. Themes and suggested actions will surface shortly.
              </p>
            </section>
          ) : null}

          <QuantitativeScoresSection
            sections={viewModel.report.sections}
            submissionCount={viewModel.report.submissionCount}
            defaultOpen={false}
          />
        </>
      )}

      <ReportExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        facultyId={facultyId}
        facultyName={viewModel.report.faculty.name}
        semesterId={viewModel.semesterId}
        semesterLabel={viewModel.semesterLabel}
        questionnaireTypeCode={viewModel.questionnaireTypeCode}
        questionnaireTypeLabel={viewModel.questionnaireTypeLabel}
      />
    </section>
  );
}
