"use client";

import { AnimatedNumber } from "@/components/animated-number";
import { getFacultyReportInterpretationTextClass } from "@/features/faculty-analytics/lib/faculty-report-detail";
import { SENTIMENT_SOLID_CLASS } from "@/features/faculty-analytics/lib/sentiment-colors";
import { cn } from "@/lib/utils";
import type { SentimentDistributionDto } from "@/features/faculty-analytics/types";

type HeadlineMetricsStripProps = {
  label: string;
  overallRating: number | null;
  overallInterpretation: string | null;
  responseCount: number | null;
  sentimentDistribution: SentimentDistributionDto | null;
};

function SentimentMiniBar({ distribution }: { distribution: SentimentDistributionDto }) {
  const total = distribution.positive + distribution.neutral + distribution.negative;
  if (total === 0) return null;

  const pct = (n: number) => `${(n / total) * 100}%`;

  return (
    <div
      role="img"
      aria-label={`${distribution.positive} positive, ${distribution.neutral} neutral, ${distribution.negative} negative`}
      className="flex h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted"
    >
      <span
        className={cn("block", SENTIMENT_SOLID_CLASS.positive)}
        style={{ width: pct(distribution.positive) }}
      />
      <span
        className={cn("block", SENTIMENT_SOLID_CLASS.neutral)}
        style={{ width: pct(distribution.neutral) }}
      />
      <span
        className={cn("block", SENTIMENT_SOLID_CLASS.negative)}
        style={{ width: pct(distribution.negative) }}
      />
    </div>
  );
}

export function HeadlineMetricsStrip({
  label,
  overallRating,
  overallInterpretation,
  responseCount,
  sentimentDistribution,
}: HeadlineMetricsStripProps) {
  const ratingCell = overallRating !== null;
  const responseCell = responseCount !== null;
  const sentimentCell =
    sentimentDistribution !== null &&
    sentimentDistribution.positive +
      sentimentDistribution.neutral +
      sentimentDistribution.negative >
      0;

  if (!ratingCell && !responseCell && !sentimentCell) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-border/70 bg-card px-5 py-4">
      {ratingCell ? (
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-playfair text-2xl font-semibold tabular-nums text-foreground">
              <AnimatedNumber value={overallRating!} decimals={2} />
            </span>
            {overallInterpretation ? (
              <span
                className={cn(
                  "text-xs font-medium",
                  getFacultyReportInterpretationTextClass(overallInterpretation)
                )}
              >
                {overallInterpretation}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {sentimentCell ? (
        <div className="min-w-[180px]">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Sentiment</p>
          <div className="mt-2">
            <SentimentMiniBar distribution={sentimentDistribution!} />
          </div>
        </div>
      ) : null}

      {responseCell ? (
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Responses</p>
          <p className="mt-1 font-playfair text-2xl font-semibold tabular-nums text-foreground">
            <AnimatedNumber value={responseCount!} />
          </p>
        </div>
      ) : null}
    </div>
  );
}
