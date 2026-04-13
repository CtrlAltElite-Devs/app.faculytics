"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeanAnalyticsEmptyState } from "@/features/faculty-analytics/components/dean-analytics-empty-state";
import { DeanAnalyticsErrorState } from "@/features/faculty-analytics/components/dean-analytics-error-state";
import { DeanAnalyticsLoadingState } from "@/features/faculty-analytics/components/dean-analytics-loading-state";
import { useFacultyReportDetailViewModel } from "@/features/faculty-analytics/hooks/use-faculty-report-detail-view-model";
import { hasFacultyReportAnalyticsData } from "@/features/faculty-analytics/lib/faculty-report-detail";

import { FacultyReportComments } from "./faculty-report-comments";
import { FacultyReportHeader } from "./faculty-report-header";
import { FacultyReportSectionPerformanceChart } from "./faculty-report-section-performance-chart";
import { FacultyReportSections } from "./faculty-report-sections";
import { FacultyReportSummaryCards } from "./faculty-report-summary-cards";

type FacultyReportScreenProps = {
  facultyId: string;
};

export function FacultyReportScreen({ facultyId }: FacultyReportScreenProps) {
  const viewModel = useFacultyReportDetailViewModel({ facultyId });

  if (!viewModel.hasSemesterContext) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <div className="flex justify-end">
          <Button asChild variant="outline" className="font-sans">
            <Link href={viewModel.backHref}>Back to Faculties</Link>
          </Button>
        </div>
        <DeanAnalyticsErrorState
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
        <DeanAnalyticsLoadingState message="Loading faculty report..." />
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
        <DeanAnalyticsErrorState
          onRetry={viewModel.retryAll}
          message="Unable to load the faculty evaluation report."
        />
      </section>
    );
  }

  const hasAnalyticsData = hasFacultyReportAnalyticsData(viewModel.report, viewModel.commentsCount);

  return (
    <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
      <FacultyReportHeader
        backHref={viewModel.backHref}
        facultyName={viewModel.report.faculty.name}
        semesterLabel={viewModel.semesterLabel}
        questionnaireTypeLabel={viewModel.questionnaireTypeLabel}
        questionnaireTypeCode={viewModel.questionnaireTypeCode}
        availableQuestionnaireTypes={viewModel.availableQuestionnaireTypes}
        isQuestionnaireTypeLoading={viewModel.isQuestionnaireTypeLoading}
        isRefreshing={viewModel.isRefreshing}
        onQuestionnaireTypeChange={viewModel.updateQuestionnaireType}
        onRefresh={viewModel.retryAll}
      />

      {!hasAnalyticsData ? (
        <DeanAnalyticsEmptyState description="No evaluation analytics are available for this faculty in the selected semester and questionnaire type yet." />
      ) : (
        <>
          <FacultyReportSummaryCards
            submissionCount={viewModel.report.submissionCount}
            overallRating={viewModel.report.overallRating}
            commentsCount={viewModel.commentsCount}
            overallInterpretation={viewModel.report.overallInterpretation}
          />

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
    </section>
  );
}
