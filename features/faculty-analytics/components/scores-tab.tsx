"use client";

import { AutoCorrectionNotice } from "@/features/faculty-analytics/components/auto-correction-notice";
import { FacultyAnalysisStats } from "@/features/faculty-analytics/components/faculty-analysis-stats";
import { QuantitativeScoresSection } from "@/features/faculty-analytics/components/quantitative-scores-section";
import { QuestionnaireTypeTabs } from "@/features/faculty-analytics/components/questionnaire-type-tabs";
import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import type {
  FacultyQuestionnaireTypeOptionDto,
  FacultyReportResponseDto,
  QualitativeSummaryResponseDto,
} from "@/features/faculty-analytics/types";
import type { ParamAutoCorrection } from "@/features/faculty-analytics/hooks/use-faculty-report-detail-view-model";

type ScoresTabProps = {
  report: FacultyReportResponseDto | null;
  semesterLabel: string;
  questionnaireTypeLabel: string;
  availableQuestionnaireTypes: FacultyQuestionnaireTypeOptionDto[];
  selectedQuestionnaireTypeCode: string | null;
  isQuestionnaireTypesLoading: boolean;
  onQuestionnaireTypeSelect: (code: string) => void;
  qualitativeSummary: QualitativeSummaryResponseDto | undefined;
  showSentimentSurface: boolean;
  commentsCount: number;
  questionnaireTypeCodeAutoCorrection: ParamAutoCorrection | null;
  onDismissQuestionnaireTypeCodeAutoCorrection: () => void;
  /** When true, render FacultyAnalysisStats here (Phase A). When false, the
   *  HeadlineMetricsStrip in the screen header carries headline metrics
   *  (Phase B). */
  renderHeadlineStats?: boolean;
};

export function ScoresTab({
  report,
  semesterLabel,
  questionnaireTypeLabel,
  availableQuestionnaireTypes,
  selectedQuestionnaireTypeCode,
  isQuestionnaireTypesLoading,
  onQuestionnaireTypeSelect,
  qualitativeSummary,
  showSentimentSurface,
  commentsCount,
  questionnaireTypeCodeAutoCorrection,
  onDismissQuestionnaireTypeCodeAutoCorrection,
  renderHeadlineStats = true,
}: ScoresTabProps) {
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
      ) : report ? (
        <>
          {renderHeadlineStats ? (
            <FacultyAnalysisStats
              submissionCount={submissionCount}
              overallRating={report.overallRating}
              overallInterpretation={report.overallInterpretation}
              commentsCount={commentsCount}
              sentimentDistribution={
                showSentimentSurface && qualitativeSummary
                  ? qualitativeSummary.sentimentDistribution
                  : null
              }
            />
          ) : null}

          <QuantitativeScoresSection
            sections={report.sections}
            dimensions={report.dimensions ?? []}
            submissionCount={submissionCount}
            collapsible={false}
          />
        </>
      ) : null}
    </div>
  );
}
