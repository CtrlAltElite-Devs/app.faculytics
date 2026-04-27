"use client";

import { AnimatedNumber } from "@/components/animated-number";
import { Skeleton } from "@/components/ui/skeleton";
import { computePositiveSentimentRate } from "@/features/faculty-analytics/lib/sentiment-rate";
import type { SentimentDistributionDto } from "@/features/faculty-analytics/types";

type FacultyPositiveSentimentCardProps = {
  distribution: SentimentDistributionDto | null;
  isLoading: boolean;
  isError: boolean;
  isSentimentReady: boolean;
};

export function FacultyPositiveSentimentCard({
  distribution,
  isLoading,
  isError,
  isSentimentReady,
}: FacultyPositiveSentimentCardProps) {
  const rate = computePositiveSentimentRate(distribution);
  const total = distribution
    ? distribution.positive + distribution.neutral + distribution.negative
    : 0;

  let valueNode: React.ReactNode;
  let description: string;

  if (!isSentimentReady) {
    valueNode = <span className="text-muted-foreground">—</span>;
    description = "Awaiting qualitative analysis. Run the pipeline to compute sentiment.";
  } else if (isLoading && !distribution) {
    valueNode = <Skeleton className="h-8 w-32" />;
    description = "Share of analyzed responses tagged positive for this faculty.";
  } else if (isError && !distribution) {
    valueNode = <span className="text-muted-foreground">—</span>;
    description = "Unable to load sentiment summary.";
  } else if (total === 0 || rate === null) {
    valueNode = <AnimatedNumber value={0} decimals={1} suffix="%" />;
    description = "No sentiment-tagged responses yet for this scope.";
  } else {
    valueNode = <AnimatedNumber value={rate} decimals={1} suffix="%" />;
    description = "Share of analyzed responses tagged positive for this faculty.";
  }

  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border/70 bg-card px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-sentiment-positive" aria-hidden />
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Overall positive sentiment rate
        </p>
      </div>
      <div className="font-playfair text-2xl font-semibold tabular-nums text-foreground">
        {valueNode}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
