"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import { ScopedAnalyticsErrorState } from "@/features/faculty-analytics/components/scoped-analytics-error-state";
import { ScopedAnalyticsLoadingState } from "@/features/faculty-analytics/components/scoped-analytics-loading-state";
import { ReportExportDialog } from "@/features/faculty-analytics/components/report-export-dialog";
import { PipelineStatusBadge } from "@/features/faculty-analytics/components/pipeline-status-badge";
import { RecommendationsCard } from "@/features/faculty-analytics/components/recommendations-card";
import { ThemesChipList } from "@/features/faculty-analytics/components/themes-chip-list";
import { useFacultyReportDetailViewModel } from "@/features/faculty-analytics/hooks/use-faculty-report-detail-view-model";
import { useLatestPipelineForScope } from "@/features/faculty-analytics/hooks/use-latest-pipeline-for-scope";
import { usePipelineRecommendations } from "@/features/faculty-analytics/hooks/use-pipeline-recommendations";
import { usePipelineStatus } from "@/features/faculty-analytics/hooks/use-pipeline-status";
import { aggregateThemes } from "@/features/faculty-analytics/lib/pipeline-themes";
import { hasFacultyReportAnalyticsData } from "@/features/faculty-analytics/lib/faculty-report-detail";
import type { PipelineStatus } from "@/features/faculty-analytics/types";

import { FacultyReportComments } from "./faculty-report-comments";
import { FacultyReportHeader } from "./faculty-report-header";
import { FacultyReportSectionPerformanceChart } from "./faculty-report-section-performance-chart";
import { FacultyReportSections } from "./faculty-report-sections";
import { FacultyReportSummaryCards } from "./faculty-report-summary-cards";

type FacultyReportScreenProps = {
  facultyId: string;
};

const RUNNING_STATUSES: ReadonlySet<PipelineStatus> = new Set<PipelineStatus>([
  "AWAITING_CONFIRMATION",
  "EMBEDDING_CHECK",
  "SENTIMENT_ANALYSIS",
  "SENTIMENT_GATE",
  "TOPIC_MODELING",
  "GENERATING_RECOMMENDATIONS",
]);

export function FacultyReportScreen({ facultyId }: FacultyReportScreenProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const viewModel = useFacultyReportDetailViewModel({ facultyId });

  const pipelineScope = useMemo(
    () => ({ semesterId: viewModel.semesterId ?? "", facultyId }),
    [viewModel.semesterId, facultyId]
  );
  const { latestPipeline } = useLatestPipelineForScope(pipelineScope, {
    enabled: Boolean(viewModel.semesterId),
  });
  // Poll live status — without this, a completed pipeline's themes+recs
  // don't appear until the next list refetch or a page refresh.
  const pipelineStatusQuery = usePipelineStatus(latestPipeline?.id ?? null, {
    enabled: Boolean(latestPipeline?.id),
  });
  const livePipelineStatus = pipelineStatusQuery.data?.status ?? latestPipeline?.status;
  const recommendationsQuery = usePipelineRecommendations(
    latestPipeline?.id ?? null,
    livePipelineStatus
  );
  const themes = useMemo(
    () => (recommendationsQuery.data ? aggregateThemes(recommendationsQuery.data.actions) : []),
    [recommendationsQuery.data]
  );

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
              {viewModel.reportTitle}
            </h1>
            <p className="mt-3 font-sans text-sm text-muted-foreground">
              Loading the faculty evaluation report for {viewModel.semesterLabel}.
            </p>
          </div>
        </div>
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
  const pipelineStatus = livePipelineStatus;
  const isPipelineRunning = pipelineStatus ? RUNNING_STATUSES.has(pipelineStatus) : false;
  const showCompletedAnalysis =
    pipelineStatus === "COMPLETED" && recommendationsQuery.data !== undefined;

  return (
    <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
      <FacultyReportHeader
        backHref={viewModel.backHref}
        facultyName={viewModel.report.faculty.name}
        semesterLabel={viewModel.semesterLabel}
        questionnaireTypeLabel={viewModel.questionnaireTypeLabel}
        questionnaireTypeCode={viewModel.questionnaireTypeCode}
        courseId={viewModel.courseId}
        courseLabel={viewModel.selectedCourseLabel}
        availableQuestionnaireTypes={viewModel.availableQuestionnaireTypes}
        availableCourses={viewModel.availableCourses}
        isQuestionnaireTypeLoading={viewModel.isQuestionnaireTypeLoading}
        isCourseLoading={viewModel.isCourseLoading}
        onQuestionnaireTypeChange={viewModel.updateQuestionnaireType}
        onCourseChange={viewModel.updateCourse}
        onExport={() => setIsExportDialogOpen(true)}
      />

      {pipelineStatus ? (
        <div className="flex items-center gap-3">
          <PipelineStatusBadge status={pipelineStatus} />
          {isPipelineRunning ? (
            <span className="font-sans text-xs text-muted-foreground">
              Analysis in progress. Themes and recommendations will appear once complete.
            </span>
          ) : null}
        </div>
      ) : null}

      {!hasAnalyticsData ? (
        <ScopedAnalyticsEmptyState description="No evaluation analytics are available for this faculty in the selected filters." />
      ) : (
        <>
          <FacultyReportSummaryCards
            submissionCount={viewModel.report.submissionCount}
            overallRating={viewModel.report.overallRating}
            commentsCount={viewModel.commentsCount}
            overallInterpretation={viewModel.report.overallInterpretation}
          />

          {showCompletedAnalysis && themes.length > 0 ? <ThemesChipList themes={themes} /> : null}

          {showCompletedAnalysis && recommendationsQuery.data ? (
            <RecommendationsCard recommendations={recommendationsQuery.data} />
          ) : null}

          <FacultyReportSectionPerformanceChart sections={viewModel.report.sections} />

          <FacultyReportSections sections={viewModel.report.sections} />

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
