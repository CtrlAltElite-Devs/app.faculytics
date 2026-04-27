"use client";

import { AutoCorrectionNotice } from "@/features/faculty-analytics/components/auto-correction-notice";
import { HeadlineMetricsStrip } from "@/features/faculty-analytics/components/headline-metrics-strip";
import { QuantitativeScoresSection } from "@/features/faculty-analytics/components/quantitative-scores-section";
import { QuestionnaireTypeTabs } from "@/features/faculty-analytics/components/questionnaire-type-tabs";
import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import type {
  FacultyQuestionnaireTypeOptionDto,
  FacultyReportResponseDto,
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
  questionnaireTypeCodeAutoCorrection: ParamAutoCorrection | null;
  onDismissQuestionnaireTypeCodeAutoCorrection: () => void;
};

export function ScoresTab({
  report,
  semesterLabel,
  questionnaireTypeLabel,
  availableQuestionnaireTypes,
  selectedQuestionnaireTypeCode,
  isQuestionnaireTypesLoading,
  onQuestionnaireTypeSelect,
  questionnaireTypeCodeAutoCorrection,
  onDismissQuestionnaireTypeCodeAutoCorrection,
}: ScoresTabProps) {
  const submissionCount = report?.submissionCount ?? 0;
  const showEmpty = report !== null && submissionCount === 0;
  const perTypeLabel = questionnaireTypeLabel ? `${questionnaireTypeLabel} rating` : "Rating";

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
          <HeadlineMetricsStrip
            label={perTypeLabel}
            overallRating={report.overallRating}
            overallInterpretation={report.overallInterpretation}
            responseCount={report.submissionCount}
            sentimentDistribution={null}
          />

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
