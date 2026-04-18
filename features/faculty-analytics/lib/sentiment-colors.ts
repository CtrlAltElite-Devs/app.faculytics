import type { SentimentLabel } from "@/features/faculty-analytics/types";

export const SENTIMENT_SOLID_CLASS: Record<SentimentLabel, string> = {
  positive: "bg-sentiment-positive",
  neutral: "bg-sentiment-neutral",
  negative: "bg-sentiment-negative",
};

export const SENTIMENT_RING_ACTIVE_CLASS: Record<SentimentLabel, string> = {
  positive: "ring-2 ring-sentiment-positive ring-offset-1",
  neutral: "ring-2 ring-sentiment-neutral ring-offset-1",
  negative: "ring-2 ring-sentiment-negative ring-offset-1",
};

export const SENTIMENT_RING_HOVER_CLASS: Record<SentimentLabel, string> = {
  positive: "hover:ring-2 hover:ring-sentiment-positive/60",
  neutral: "hover:ring-2 hover:ring-sentiment-neutral/60",
  negative: "hover:ring-2 hover:ring-sentiment-negative/60",
};

export const SENTIMENT_BADGE_CLASS: Record<SentimentLabel, string> = {
  positive: "badge-sentiment-positive",
  neutral: "badge-sentiment-neutral",
  negative: "badge-sentiment-negative",
};

export const SENTIMENT_FILTER_CHIP_CLASS: Record<SentimentLabel, string> = {
  positive:
    "data-[active=true]:bg-sentiment-positive-soft data-[active=true]:text-sentiment-positive-fg data-[active=true]:border-sentiment-positive/40",
  neutral:
    "data-[active=true]:bg-sentiment-neutral-soft data-[active=true]:text-sentiment-neutral-fg data-[active=true]:border-sentiment-neutral/40",
  negative:
    "data-[active=true]:bg-sentiment-negative-soft data-[active=true]:text-sentiment-negative-fg data-[active=true]:border-sentiment-negative/40",
};

export const SENTIMENT_HEX: Record<SentimentLabel, string> = {
  positive: "#2f48d4",
  neutral: "#f59e0b",
  negative: "#f43f5e",
};

export const SENTIMENT_LABEL: Record<SentimentLabel, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};
