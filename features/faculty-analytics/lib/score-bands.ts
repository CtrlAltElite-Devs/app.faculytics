export type ScoreBandKey =
  | "excellent"
  | "very-satisfactory"
  | "satisfactory"
  | "fair"
  | "needs-improvement";

export type ScoreBand = {
  key: ScoreBandKey;
  label: string;
  hero: string;
  border: string;
  text: string;
  dot: string;
};

export const SCORE_BANDS: Record<ScoreBandKey, ScoreBand> = {
  excellent: {
    key: "excellent",
    label: "Excellent",
    hero: "bg-gradient-to-b from-emerald-50 to-emerald-50/30 dark:from-emerald-950/40 dark:to-emerald-950/10",
    border: "border-emerald-200/70 dark:border-emerald-900/60",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  "very-satisfactory": {
    key: "very-satisfactory",
    label: "Very Satisfactory",
    hero: "bg-gradient-to-b from-blue-50 to-blue-50/30 dark:from-blue-950/40 dark:to-blue-950/10",
    border: "border-blue-200/70 dark:border-blue-900/60",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  satisfactory: {
    key: "satisfactory",
    label: "Satisfactory",
    hero: "bg-gradient-to-b from-amber-50 to-amber-50/30 dark:from-amber-950/40 dark:to-amber-950/10",
    border: "border-amber-200/70 dark:border-amber-900/60",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  fair: {
    key: "fair",
    label: "Fair",
    hero: "bg-gradient-to-b from-orange-50 to-orange-50/30 dark:from-orange-950/40 dark:to-orange-950/10",
    border: "border-orange-200/70 dark:border-orange-900/60",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  "needs-improvement": {
    key: "needs-improvement",
    label: "Needs Improvement",
    hero: "bg-gradient-to-b from-red-50 to-red-50/30 dark:from-red-950/40 dark:to-red-950/10",
    border: "border-red-200/70 dark:border-red-900/60",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
};

export function bandForScore(score: number): ScoreBand {
  if (score >= 90) return SCORE_BANDS.excellent;
  if (score >= 80) return SCORE_BANDS["very-satisfactory"];
  if (score >= 70) return SCORE_BANDS.satisfactory;
  if (score >= 60) return SCORE_BANDS.fair;
  return SCORE_BANDS["needs-improvement"];
}
