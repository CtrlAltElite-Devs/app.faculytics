"use client";

import { AnimatedNumber } from "@/components/animated-number";
import { getFacultyReportInterpretationTextClass } from "@/features/faculty-analytics/lib/faculty-report-detail";
import { cn } from "@/lib/utils";
import type { SentimentDistributionDto } from "@/features/faculty-analytics/types";

type FacultyAnalysisStatsProps = {
  submissionCount: number;
  overallRating: number | null;
  overallInterpretation: string | null;
  commentsCount: number;
  sentimentDistribution: SentimentDistributionDto | null;
};

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  description: string;
  valueClassName?: string;
};

function StatCard({ label, value, description, valueClassName }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 font-playfair text-3xl font-semibold tabular-nums text-foreground",
          valueClassName
        )}
      >
        {value}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

export function FacultyAnalysisStats({
  submissionCount,
  overallRating,
  overallInterpretation,
  commentsCount,
  sentimentDistribution,
}: FacultyAnalysisStatsProps) {
  const resolvedInterpretation = overallInterpretation ?? "No interpretation available";

  const sentimentTotal = sentimentDistribution
    ? sentimentDistribution.positive +
      sentimentDistribution.neutral +
      sentimentDistribution.negative
    : 0;
  const positivePct =
    sentimentTotal > 0 && sentimentDistribution
      ? (sentimentDistribution.positive / sentimentTotal) * 100
      : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Overall Rating"
        value={
          overallRating === null ? "N/A" : <AnimatedNumber value={overallRating} decimals={2} />
        }
        description="Weighted average score across all sections in this report"
      />
      <div className="rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Interpretation</p>
        <p
          className={cn(
            "mt-2 text-lg font-semibold leading-snug",
            getFacultyReportInterpretationTextClass(resolvedInterpretation)
          )}
        >
          {resolvedInterpretation}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Performance label derived from the overall weighted rating
        </p>
      </div>
      <StatCard
        label="Submissions"
        value={<AnimatedNumber value={submissionCount} />}
        description="Submitted evaluation responses included in this report"
      />
      <StatCard
        label="Positive Sentiment"
        value={
          positivePct === null ? (
            "—"
          ) : (
            <span>
              <AnimatedNumber value={positivePct} decimals={1} />
              <span className="ml-0.5 text-2xl font-medium">%</span>
            </span>
          )
        }
        description={
          commentsCount > 0
            ? `Share of positive sentiment across ${commentsCount} analyzed comment${commentsCount === 1 ? "" : "s"}`
            : "Awaiting analyzed comments"
        }
      />
    </div>
  );
}
