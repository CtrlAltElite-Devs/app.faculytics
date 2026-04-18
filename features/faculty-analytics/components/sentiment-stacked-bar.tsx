"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SENTIMENT_LABEL,
  SENTIMENT_RING_ACTIVE_CLASS,
  SENTIMENT_RING_HOVER_CLASS,
  SENTIMENT_SOLID_CLASS,
} from "@/features/faculty-analytics/lib/sentiment-colors";
import { cn } from "@/lib/utils";
import type { SentimentDistributionDto, SentimentLabel } from "@/features/faculty-analytics/types";

type SentimentStackedBarProps = {
  distribution: SentimentDistributionDto;
  activeSentiment: SentimentLabel | null;
  onSegmentClick: (sentiment: SentimentLabel | null) => void;
};

const SEGMENT_ORDER: SentimentLabel[] = ["positive", "neutral", "negative"];

export function SentimentStackedBar({
  distribution,
  activeSentiment,
  onSegmentClick,
}: SentimentStackedBarProps) {
  const total = distribution.positive + distribution.neutral + distribution.negative;
  const hasData = total > 0;

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Sentiment at a glance</CardTitle>
        <CardDescription>
          Click a segment to filter comments by sentiment. Click again to clear.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
            aria-label="No sentiment data yet"
          />
        ) : (
          <div
            className="flex h-5 w-full overflow-hidden rounded-full bg-muted"
            role="group"
            aria-label="Sentiment distribution"
          >
            {SEGMENT_ORDER.map((sentiment) => {
              const count = distribution[sentiment];
              if (count === 0) return null;
              const widthPct = (count / total) * 100;
              const isActive = activeSentiment === sentiment;

              return (
                <button
                  key={sentiment}
                  type="button"
                  onClick={() => onSegmentClick(isActive ? null : sentiment)}
                  className={cn(
                    "h-full transition-all",
                    SENTIMENT_SOLID_CLASS[sentiment],
                    isActive
                      ? SENTIMENT_RING_ACTIVE_CLASS[sentiment]
                      : SENTIMENT_RING_HOVER_CLASS[sentiment],
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    "cursor-pointer"
                  )}
                  style={{ width: `${widthPct}%` }}
                  aria-label={`Filter comments to ${SENTIMENT_LABEL[sentiment].toLowerCase()} sentiment, ${count} submissions`}
                  aria-pressed={isActive}
                />
              );
            })}
          </div>
        )}

        <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 font-sans text-xs tabular-nums text-muted-foreground">
          {SEGMENT_ORDER.map((sentiment) => (
            <div key={sentiment} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-block h-2.5 w-2.5 rounded-full",
                  SENTIMENT_SOLID_CLASS[sentiment]
                )}
              />
              <dt className="font-medium text-foreground">{SENTIMENT_LABEL[sentiment]}</dt>
              <dd>{distribution[sentiment]}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
