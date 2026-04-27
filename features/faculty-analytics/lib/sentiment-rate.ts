import type { SentimentDistributionDto } from "@/features/faculty-analytics/types";

export function computePositiveSentimentRate(
  distribution: SentimentDistributionDto | null | undefined
): number | null {
  if (!distribution) return null;
  const total = distribution.positive + distribution.neutral + distribution.negative;
  if (total <= 0) return null;
  return (distribution.positive / total) * 100;
}
