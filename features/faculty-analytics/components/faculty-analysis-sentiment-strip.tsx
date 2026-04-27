"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SENTIMENT_LABEL,
  SENTIMENT_SOLID_CLASS,
} from "@/features/faculty-analytics/lib/sentiment-colors";
import { cn } from "@/lib/utils";
import type { SentimentDistributionDto, SentimentLabel } from "@/features/faculty-analytics/types";

type FacultyAnalysisSentimentStripProps = {
  distribution: SentimentDistributionDto | null;
  sentimentFilter: SentimentLabel | null;
  themeLabelFilter: string | null;
  onSentimentClick: (sentiment: SentimentLabel | null) => void;
  onClearSentiment: () => void;
  onClearTheme: () => void;
  onClearAll: () => void;
};

const ORDER: SentimentLabel[] = ["positive", "neutral", "negative"];

export function FacultyAnalysisSentimentStrip({
  distribution,
  sentimentFilter,
  themeLabelFilter,
  onSentimentClick,
  onClearSentiment,
  onClearTheme,
  onClearAll,
}: FacultyAnalysisSentimentStripProps) {
  if (!distribution) return null;
  const total = distribution.positive + distribution.neutral + distribution.negative;
  if (total === 0) return null;

  const hasActiveFilter = Boolean(sentimentFilter || themeLabelFilter);

  return (
    <section className="rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Sentiment distribution</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Click a segment to filter the comments shown below.
              </p>
            </div>
            <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {total} {total === 1 ? "response" : "responses"}
            </p>
          </div>

          <div
            className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-muted"
            role="group"
            aria-label="Sentiment distribution"
          >
            {ORDER.map((s) => {
              const count = distribution[s];
              if (count === 0) return null;
              const widthPct = (count / total) * 100;
              const isActive = sentimentFilter === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSentimentClick(isActive ? null : s)}
                  className={cn(
                    "h-full transition-all hover:brightness-110",
                    SENTIMENT_SOLID_CLASS[s],
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    isActive ? "brightness-110 ring-2 ring-ring ring-offset-1" : "",
                    sentimentFilter && !isActive ? "opacity-40" : ""
                  )}
                  style={{ width: `${widthPct}%` }}
                  aria-label={`Filter comments to ${SENTIMENT_LABEL[s].toLowerCase()} sentiment, ${count} submissions`}
                  aria-pressed={isActive}
                />
              );
            })}
          </div>

          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            {ORDER.map((s) => {
              const count = distribution[s];
              const pct = Math.round((count / total) * 100);
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <span
                    className={cn("inline-block h-2 w-2 rounded-full", SENTIMENT_SOLID_CLASS[s])}
                  />
                  <span>{SENTIMENT_LABEL[s]}</span>
                  <span className="tabular-nums text-foreground">{count}</span>
                  <span className="tabular-nums text-muted-foreground/70">({pct}%)</span>
                </div>
              );
            })}
          </dl>
        </div>
      </div>

      {hasActiveFilter ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
          <span className="text-xs text-muted-foreground">Filtering</span>
          {themeLabelFilter ? (
            <Badge
              variant="outline"
              className="gap-1 rounded-full border-border bg-background px-3 py-1 text-xs"
            >
              <span>Theme · {themeLabelFilter}</span>
              <button
                type="button"
                onClick={onClearTheme}
                className="ml-1 rounded-full p-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Clear theme filter ${themeLabelFilter}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : null}
          {sentimentFilter ? (
            <Badge
              variant="outline"
              className="gap-1 rounded-full border-border bg-background px-3 py-1 text-xs"
            >
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5 rounded-full",
                  SENTIMENT_SOLID_CLASS[sentimentFilter]
                )}
              />
              <span>Sentiment · {SENTIMENT_LABEL[sentimentFilter]}</span>
              <button
                type="button"
                onClick={onClearSentiment}
                className="ml-1 rounded-full p-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Clear sentiment filter ${SENTIMENT_LABEL[sentimentFilter]}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={onClearAll}
          >
            Clear all
          </Button>
        </div>
      ) : null}
    </section>
  );
}
