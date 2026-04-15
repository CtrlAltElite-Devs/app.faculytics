"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SentimentLabel } from "@/features/faculty-analytics/types";

type ActiveFilterChipsProps = {
  sentiment: SentimentLabel | null;
  themeLabel: string | null;
  onClearSentiment: () => void;
  onClearTheme: () => void;
  onClearAll: () => void;
};

const SENTIMENT_DISPLAY: Record<SentimentLabel, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

export function ActiveFilterChips({
  sentiment,
  themeLabel,
  onClearSentiment,
  onClearTheme,
  onClearAll,
}: ActiveFilterChipsProps) {
  if (!sentiment && !themeLabel) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
        Filters
      </span>
      {themeLabel ? (
        <Badge variant="secondary" className="gap-1 rounded-full pl-3 pr-1 py-1">
          <span className="font-medium">Theme: {themeLabel}</span>
          <button
            type="button"
            onClick={onClearTheme}
            className="ml-1 rounded-full p-0.5 hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Clear theme filter ${themeLabel}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ) : null}
      {sentiment ? (
        <Badge variant="secondary" className="gap-1 rounded-full pl-3 pr-1 py-1">
          <span className="font-medium">Sentiment: {SENTIMENT_DISPLAY[sentiment]}</span>
          <button
            type="button"
            onClick={onClearSentiment}
            className="ml-1 rounded-full p-0.5 hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Clear sentiment filter ${SENTIMENT_DISPLAY[sentiment]}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ) : null}
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-7 px-2 font-sans text-xs text-muted-foreground hover:text-foreground"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  );
}
