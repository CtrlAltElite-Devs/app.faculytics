"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutoCorrectionNotice } from "@/features/faculty-analytics/components/auto-correction-notice";
import { FeedbackTab } from "@/features/faculty-analytics/components/feedback-tab";
import { HeadlineMetricsStrip } from "@/features/faculty-analytics/components/headline-metrics-strip";
import { InsightsTab } from "@/features/faculty-analytics/components/insights-tab";
import { PipelineTriggerCard } from "@/features/faculty-analytics/components/pipeline-trigger-card";
import { ReportExportDialog } from "@/features/faculty-analytics/components/report-export-dialog";
import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import { ScopedAnalyticsErrorState } from "@/features/faculty-analytics/components/scoped-analytics-error-state";
import { ScopedAnalyticsLoadingState } from "@/features/faculty-analytics/components/scoped-analytics-loading-state";
import { ScoresTab } from "@/features/faculty-analytics/components/scores-tab";
import { useFacultyReportDetailViewModel } from "@/features/faculty-analytics/hooks/use-faculty-report-detail-view-model";
import { useLatestPipelineForScope } from "@/features/faculty-analytics/hooks/use-latest-pipeline-for-scope";
import { usePipelineRecommendations } from "@/features/faculty-analytics/hooks/use-pipeline-recommendations";
import { usePipelineStatus } from "@/features/faculty-analytics/hooks/use-pipeline-status";
import { hasFacultyReportAnalyticsData } from "@/features/faculty-analytics/lib/faculty-report-detail";
import {
  REPORT_VIEW_LABELS,
  REPORT_VIEW_ORDER,
  type PipelineStatus,
  type ReportView,
} from "@/features/faculty-analytics/types";

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

  const showSentimentSurface = livePipelineStatus
    ? SENTIMENT_READY_STATUSES.has(livePipelineStatus)
    : false;
  const showThemesSurface = livePipelineStatus === "COMPLETED";

  // Stable disabled derivation: keyed on latestPipeline (not the polling
  // status), so chips don't flicker mid-click.
  const filtersDisabled = latestPipeline?.status !== "COMPLETED";

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
            <Link href={viewModel.backHref}>{viewModel.backLabel}</Link>
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
            <Link href={viewModel.backHref}>{viewModel.backLabel}</Link>
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
        />
      </div>

      <HeadlineMetricsStrip
        overallRating={viewModel.report.overallRating}
        overallInterpretation={viewModel.report.overallInterpretation}
        responseCount={viewModel.report.submissionCount}
        sentimentDistribution={
          showSentimentSurface && qualitativeSummary
            ? qualitativeSummary.sentimentDistribution
            : null
        }
      />

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {viewModel.viewAutoCorrection ? (
        <AutoCorrectionNotice
          requested={viewModel.viewAutoCorrection.requested}
          actual={viewModel.viewAutoCorrection.actual}
          paramLabel="view"
          onDismiss={viewModel.dismissViewAutoCorrection}
        />
      ) : null}

      {!hasAnalyticsData ? (
        <ScopedAnalyticsEmptyState description="No evaluation analytics are available for this faculty in the selected filters." />
      ) : (
        <>
          {viewModel.semesterId ? (
            <PipelineTriggerCard scope={pipelineScope} pipeline={latestPipeline} />
          ) : null}

          <Tabs
            value={viewModel.selectedView}
            onValueChange={(value) => viewModel.selectView(value as ReportView)}
            className="w-full"
          >
            <TabsList variant="line" className="w-full gap-0 border-b border-border/40">
              {REPORT_VIEW_ORDER.map((view) => (
                <TabsTrigger
                  key={view}
                  value={view}
                  className="px-4 py-2.5 font-sans text-sm tracking-tight after:bg-brand-blue data-[state=active]:text-brand-blue sm:px-5 dark:data-[state=active]:text-brand-blue"
                >
                  {REPORT_VIEW_LABELS[view]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="insights" className="mt-6">
              <InsightsTab
                facultyId={facultyId}
                semesterId={viewModel.semesterId}
                questionnaireTypeCode={viewModel.questionnaireTypeCode}
                qualitativeSummary={qualitativeSummary}
                recommendations={recommendationsQuery.data}
                livePipelineStatus={livePipelineStatus}
                showSentimentSurface={showSentimentSurface}
                showThemesSurface={showThemesSurface}
                sentimentFilter={viewModel.sentimentFilter}
                themeLabelFilter={viewModel.themeLabelFilter}
                onSentimentClick={viewModel.updateSentimentFilter}
                onThemeClick={viewModel.updateThemeFilter}
                onClearAllFilters={viewModel.clearAllFilters}
                comments={viewModel.comments}
                commentsMeta={viewModel.commentsMeta}
                commentsPage={viewModel.commentsPage}
                commentsLimit={viewModel.commentsLimit}
                isCommentsLoading={viewModel.commentsQuery.isLoading}
                isCommentsError={viewModel.commentsQuery.isError}
                onCommentsRetry={viewModel.retryComments}
                onCommentsPageChange={viewModel.updateCommentsPage}
                onCommentsRowsPerPageChange={viewModel.updateCommentsLimit}
                themeLabelAutoCorrection={viewModel.themeLabelAutoCorrection}
                onDismissThemeLabelAutoCorrection={viewModel.dismissThemeLabelAutoCorrection}
              />
            </TabsContent>

            <TabsContent value="scores" className="mt-6">
              <ScoresTab
                report={viewModel.report}
                semesterLabel={viewModel.semesterLabel}
                questionnaireTypeLabel={viewModel.questionnaireTypeLabel}
                availableQuestionnaireTypes={viewModel.availableQuestionnaireTypes}
                selectedQuestionnaireTypeCode={viewModel.questionnaireTypeCode}
                isQuestionnaireTypesLoading={viewModel.isQuestionnaireTypeLoading}
                onQuestionnaireTypeSelect={viewModel.selectQuestionnaireType}
                qualitativeSummary={qualitativeSummary}
                showSentimentSurface={showSentimentSurface}
                commentsCount={viewModel.commentsCount}
                questionnaireTypeCodeAutoCorrection={viewModel.questionnaireTypeCodeAutoCorrection}
                onDismissQuestionnaireTypeCodeAutoCorrection={
                  viewModel.dismissQuestionnaireTypeCodeAutoCorrection
                }
                renderHeadlineStats={false}
              />
            </TabsContent>

            <TabsContent value="feedback" className="mt-6">
              <FeedbackTab
                report={viewModel.report}
                semesterLabel={viewModel.semesterLabel}
                questionnaireTypeLabel={viewModel.questionnaireTypeLabel}
                availableQuestionnaireTypes={viewModel.availableQuestionnaireTypes}
                selectedQuestionnaireTypeCode={viewModel.questionnaireTypeCode}
                isQuestionnaireTypesLoading={viewModel.isQuestionnaireTypeLoading}
                onQuestionnaireTypeSelect={viewModel.selectQuestionnaireType}
                qualitativeSummary={qualitativeSummary}
                filtersDisabled={filtersDisabled}
                filtersDisabledReason={
                  filtersDisabled
                    ? "Run qualitative analysis to enable sentiment and topic filters."
                    : undefined
                }
                sentimentFilter={viewModel.sentimentFilter}
                resolvedThemeId={viewModel.resolvedThemeId}
                onSentimentChange={viewModel.updateSentimentFilter}
                onThemeChange={viewModel.updateThemeFilter}
                comments={viewModel.comments}
                commentsMeta={viewModel.commentsMeta}
                commentsPage={viewModel.commentsPage}
                commentsLimit={viewModel.commentsLimit}
                isCommentsLoading={viewModel.commentsQuery.isLoading}
                isCommentsError={viewModel.commentsQuery.isError}
                onCommentsRetry={viewModel.retryComments}
                onCommentsPageChange={viewModel.updateCommentsPage}
                onCommentsRowsPerPageChange={viewModel.updateCommentsLimit}
                questionnaireTypeCodeAutoCorrection={viewModel.questionnaireTypeCodeAutoCorrection}
                onDismissQuestionnaireTypeCodeAutoCorrection={
                  viewModel.dismissQuestionnaireTypeCodeAutoCorrection
                }
                themeLabelAutoCorrection={viewModel.themeLabelAutoCorrection}
                onDismissThemeLabelAutoCorrection={viewModel.dismissThemeLabelAutoCorrection}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      <ReportExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        facultyId={facultyId}
        facultyName={viewModel.report.faculty.name}
        semesterId={viewModel.semesterId}
        semesterLabel={viewModel.semesterLabel}
        questionnaireTypeCode={viewModel.questionnaireTypeCode ?? ""}
        questionnaireTypeLabel={viewModel.questionnaireTypeLabel}
      />
    </section>
  );
}
