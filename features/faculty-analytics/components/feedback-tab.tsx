"use client";

import { AutoCorrectionNotice } from "@/features/faculty-analytics/components/auto-correction-notice";
import { FacultyReportComments } from "@/features/faculty-analytics/components/faculty-report-comments";
import { FeedbackFilterBar } from "@/features/faculty-analytics/components/feedback-filter-bar";
import { QuestionnaireTypeTabs } from "@/features/faculty-analytics/components/questionnaire-type-tabs";
import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import type {
  FacultyQuestionnaireTypeOptionDto,
  FacultyReportCommentDto,
  FacultyReportResponseDto,
  PaginationMetaDto,
  QualitativeSummaryResponseDto,
  SentimentLabel,
} from "@/features/faculty-analytics/types";
import type { ParamAutoCorrection } from "@/features/faculty-analytics/hooks/use-faculty-report-detail-view-model";

type FeedbackTabProps = {
  report: FacultyReportResponseDto | null;
  semesterLabel: string;
  questionnaireTypeLabel: string;
  availableQuestionnaireTypes: FacultyQuestionnaireTypeOptionDto[];
  selectedQuestionnaireTypeCode: string | null;
  isQuestionnaireTypesLoading: boolean;
  onQuestionnaireTypeSelect: (code: string) => void;
  qualitativeSummary: QualitativeSummaryResponseDto | undefined;
  /** Stable: derived from latestPipeline?.status, NOT the polling status. */
  filtersDisabled: boolean;
  filtersDisabledReason?: string;
  sentimentFilter: SentimentLabel | null;
  resolvedThemeId: string | null;
  onSentimentChange: (next: SentimentLabel | null) => void;
  onThemeChange: (label: string | null) => void;
  comments: FacultyReportCommentDto[];
  commentsMeta: PaginationMetaDto | null;
  commentsPage: number;
  commentsLimit: number;
  isCommentsLoading: boolean;
  isCommentsError: boolean;
  onCommentsRetry: () => void;
  onCommentsPageChange: (page: number) => void;
  onCommentsRowsPerPageChange: (value: number) => void;
  questionnaireTypeCodeAutoCorrection: ParamAutoCorrection | null;
  onDismissQuestionnaireTypeCodeAutoCorrection: () => void;
  themeLabelAutoCorrection: ParamAutoCorrection | null;
  onDismissThemeLabelAutoCorrection: () => void;
};

export function FeedbackTab({
  report,
  semesterLabel,
  questionnaireTypeLabel,
  availableQuestionnaireTypes,
  selectedQuestionnaireTypeCode,
  isQuestionnaireTypesLoading,
  onQuestionnaireTypeSelect,
  qualitativeSummary,
  filtersDisabled,
  filtersDisabledReason,
  sentimentFilter,
  resolvedThemeId,
  onSentimentChange,
  onThemeChange,
  comments,
  commentsMeta,
  commentsPage,
  commentsLimit,
  isCommentsLoading,
  isCommentsError,
  onCommentsRetry,
  onCommentsPageChange,
  onCommentsRowsPerPageChange,
  questionnaireTypeCodeAutoCorrection,
  onDismissQuestionnaireTypeCodeAutoCorrection,
  themeLabelAutoCorrection,
  onDismissThemeLabelAutoCorrection,
}: FeedbackTabProps) {
  const submissionCount = report?.submissionCount ?? 0;
  const showEmpty = report !== null && submissionCount === 0;

  return (
    <div className="space-y-6">
      {questionnaireTypeCodeAutoCorrection ? (
        <AutoCorrectionNotice
          requested={questionnaireTypeCodeAutoCorrection.requested}
          actual={questionnaireTypeCodeAutoCorrection.actual}
          paramLabel="questionnaire"
          onDismiss={onDismissQuestionnaireTypeCodeAutoCorrection}
        />
      ) : null}

      {themeLabelAutoCorrection ? (
        <AutoCorrectionNotice
          requested={themeLabelAutoCorrection.requested}
          actual={themeLabelAutoCorrection.actual}
          paramLabel="topic"
          onDismiss={onDismissThemeLabelAutoCorrection}
        />
      ) : null}

      <QuestionnaireTypeTabs
        types={availableQuestionnaireTypes}
        selectedCode={selectedQuestionnaireTypeCode}
        onSelect={onQuestionnaireTypeSelect}
        isLoading={isQuestionnaireTypesLoading}
      />

      {showEmpty ? (
        <ScopedAnalyticsEmptyState
          description={`No submissions for ${semesterLabel} · ${questionnaireTypeLabel}.`}
        />
      ) : (
        <>
          <FeedbackFilterBar
            themes={qualitativeSummary?.themes ?? []}
            sentimentFilter={sentimentFilter}
            resolvedThemeId={resolvedThemeId}
            onSentimentChange={onSentimentChange}
            onThemeChange={onThemeChange}
            disabled={filtersDisabled}
            disabledReason={filtersDisabledReason}
          />
          <FacultyReportComments
            comments={comments}
            commentsMeta={commentsMeta}
            commentsPage={commentsPage}
            commentsLimit={commentsLimit}
            isLoading={isCommentsLoading}
            isError={isCommentsError}
            onRetry={onCommentsRetry}
            onPageChange={onCommentsPageChange}
            onRowsPerPageChange={onCommentsRowsPerPageChange}
            themes={qualitativeSummary?.themes}
          />
        </>
      )}
    </div>
  );
}
