import type { ScopedFacultyRankingRow } from "@/features/faculty-analytics/lib/scoped-analytics-view-model";

export const UNAVAILABLE = "--";

export const POSITIVE_TONE = "text-emerald-700 dark:text-emerald-300";
export const NEGATIVE_TONE = "text-red-700 dark:text-red-300";
export const NEUTRAL_TONE = "text-foreground";

export function formatScore(value: number) {
  return value.toFixed(2);
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatSignedValue(value: number | null, formatter: (value: number) => string) {
  if (value === null) {
    return UNAVAILABLE;
  }

  return `${value >= 0 ? "+" : ""}${formatter(value)}`;
}

export function formatSignedScore(value: number | null) {
  return formatSignedValue(value, (score) => score.toFixed(2));
}

export function formatSignedPercentagePoint(value: number | null) {
  return formatSignedValue(value, (sentiment) => `${(sentiment * 100).toFixed(1)} pts`);
}

export function getFacultyInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getScoreTone(score: number) {
  if (score >= 80) {
    return POSITIVE_TONE;
  }

  if (score < 60) {
    return NEGATIVE_TONE;
  }

  return NEUTRAL_TONE;
}

export function getSentimentTone(row: ScopedFacultyRankingRow) {
  if (row.positiveCount > row.negativeCount && row.positiveCount >= row.neutralCount) {
    return POSITIVE_TONE;
  }

  if (row.negativeCount > row.positiveCount && row.negativeCount >= row.neutralCount) {
    return NEGATIVE_TONE;
  }

  return NEUTRAL_TONE;
}

export function getDeltaTone(value: number | null) {
  if (value === null || value === 0) {
    return NEUTRAL_TONE;
  }

  return value > 0 ? POSITIVE_TONE : NEGATIVE_TONE;
}
