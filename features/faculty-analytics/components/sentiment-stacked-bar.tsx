"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SentimentDistributionDto, SentimentLabel } from "@/features/faculty-analytics/types";

type SentimentStackedBarProps = {
  distribution: SentimentDistributionDto;
  activeSentiment: SentimentLabel | null;
  onSegmentClick: (sentiment: SentimentLabel | null) => void;
};

const SEGMENT_STYLES: Record<
  SentimentLabel,
  { fill: string; ringActive: string; ringInactive: string; label: string }
> = {
  positive: {
    fill: "bg-emerald-500",
    ringActive: "ring-2 ring-emerald-600 ring-offset-1",
    ringInactive: "hover:ring-2 hover:ring-emerald-400/60",
    label: "Positive",
  },
  neutral: {
    fill: "bg-muted-foreground/40",
    ringActive: "ring-2 ring-muted-foreground ring-offset-1",
    ringInactive: "hover:ring-2 hover:ring-muted-foreground/60",
    label: "Neutral",
  },
  negative: {
    fill: "bg-rose-500",
    ringActive: "ring-2 ring-rose-600 ring-offset-1",
    ringInactive: "hover:ring-2 hover:ring-rose-400/60",
    label: "Negative",
  },
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
              const style = SEGMENT_STYLES[sentiment];
              const isActive = activeSentiment === sentiment;

              return (
                <button
                  key={sentiment}
                  type="button"
                  onClick={() => onSegmentClick(isActive ? null : sentiment)}
                  className={cn(
                    "h-full transition-all",
                    style.fill,
                    isActive ? style.ringActive : style.ringInactive,
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    "cursor-pointer"
                  )}
                  style={{ width: `${widthPct}%` }}
                  aria-label={`Filter comments to ${style.label.toLowerCase()} sentiment, ${count} submissions`}
                  aria-pressed={isActive}
                />
              );
            })}
          </div>
        )}

        <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 font-sans text-xs tabular-nums text-muted-foreground">
          {SEGMENT_ORDER.map((sentiment) => {
            const style = SEGMENT_STYLES[sentiment];
            return (
              <div key={sentiment} className="flex items-center gap-2">
                <span className={cn("inline-block h-2.5 w-2.5 rounded-full", style.fill)} />
                <dt className="font-medium text-foreground">{style.label}</dt>
                <dd>{distribution[sentiment]}</dd>
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}
