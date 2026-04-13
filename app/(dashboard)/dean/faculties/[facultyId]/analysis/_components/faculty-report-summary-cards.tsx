"use client";

import {
  formatFacultyReportScore,
  getFacultyReportInterpretationTextClass,
} from "@/features/faculty-analytics/lib/faculty-report-detail";

type FacultyReportSummaryCardsProps = {
  submissionCount: number;
  overallRating: number | null;
  commentsCount: number;
  overallInterpretation: string | null;
};

type SummaryCardProps = {
  label: string;
  value: React.ReactNode;
  description: string;
};

function SummaryCard({ label, value, description }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-sm">
      <div className="min-w-0">
        <p className="font-sans text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 font-playfair text-3xl font-semibold text-foreground">{value}</p>
        <p className="mt-4 font-sans text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function FacultyReportSummaryCards({
  submissionCount,
  overallRating,
  commentsCount,
  overallInterpretation,
}: FacultyReportSummaryCardsProps) {
  const resolvedOverallInterpretation = overallInterpretation ?? "No interpretation available";

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Submissions"
        value={String(submissionCount)}
        description="Submitted evaluation responses included in this report context"
      />
      <SummaryCard
        label="Overall Rating"
        value={formatFacultyReportScore(overallRating)}
        description="Weighted average score across all sections in this report"
      />
      <SummaryCard
        label="Comments"
        value={String(commentsCount)}
        description="Qualitative comments submitted for this faculty report"
      />
      <SummaryCard
        label="Overall Interpretation"
        value={
          <span className={getFacultyReportInterpretationTextClass(resolvedOverallInterpretation)}>
            {resolvedOverallInterpretation}
          </span>
        }
        description="Performance label derived from the overall weighted rating"
      />
    </div>
  );
}
