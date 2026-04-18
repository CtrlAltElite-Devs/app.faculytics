"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PipelineStatusBadge } from "@/features/faculty-analytics/components/pipeline-status-badge";
import {
  formatFacultyReportScore,
  getFacultyReportInterpretationTextClass,
} from "@/features/faculty-analytics/lib/faculty-report-detail";
import {
  SENTIMENT_LABEL,
  SENTIMENT_SOLID_CLASS,
} from "@/features/faculty-analytics/lib/sentiment-colors";
import { cn } from "@/lib/utils";
import type {
  PipelineStatus,
  SentimentDistributionDto,
  SentimentLabel,
} from "@/features/faculty-analytics/types";

type FacultyAnalysisHeroProps = {
  facultyName: string;
  semesterLabel: string;
  questionnaireTypeLabel: string;
  overallRating: number | null;
  overallInterpretation: string | null;
  submissionCount: number;
  commentsCount: number;
  sentimentDistribution: SentimentDistributionDto | null;
  pipelineStatus?: PipelineStatus;
  sentimentFilter: SentimentLabel | null;
  themeLabelFilter: string | null;
  onSentimentClick: (sentiment: SentimentLabel | null) => void;
  onClearSentiment: () => void;
  onClearTheme: () => void;
  onClearAll: () => void;
};

const SEGMENT_ORDER: SentimentLabel[] = ["positive", "neutral", "negative"];

export function FacultyAnalysisHero({
  facultyName,
  semesterLabel,
  questionnaireTypeLabel,
  overallRating,
  overallInterpretation,
  submissionCount,
  commentsCount,
  sentimentDistribution,
  pipelineStatus,
  sentimentFilter,
  themeLabelFilter,
  onSentimentClick,
  onClearSentiment,
  onClearTheme,
  onClearAll,
}: FacultyAnalysisHeroProps) {
  const interpretation = overallInterpretation ?? "Not available";
  const totalSentiment = sentimentDistribution
    ? sentimentDistribution.positive +
      sentimentDistribution.neutral +
      sentimentDistribution.negative
    : 0;
  const hasSentimentData = totalSentiment > 0;
  const hasActiveFilter = Boolean(sentimentFilter || themeLabelFilter);

  return (
    <header className="rounded-2xl border border-border/70 bg-card px-6 py-8 shadow-sm sm:px-10 sm:py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        {/* LEFT: identity + verdict */}
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            Faculty evaluation · {semesterLabel}
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {facultyName}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{questionnaireTypeLabel}</p>

          {/* Verdict row — big rating + interpretation */}
          <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-4">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                Overall rating
              </p>
              <p className="mt-2 font-playfair text-5xl font-semibold leading-none tracking-tight text-foreground tabular-nums sm:text-6xl">
                {formatFacultyReportScore(overallRating)}
              </p>
            </div>
            <div className="max-w-xs">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                Interpretation
              </p>
              <p
                className={cn(
                  "mt-2 text-base leading-snug",
                  getFacultyReportInterpretationTextClass(interpretation)
                )}
              >
                {interpretation}
              </p>
            </div>
          </div>

          {/* Coverage line */}
          <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span>
              <span className="font-medium tabular-nums text-foreground">{submissionCount}</span>{" "}
              submissions
            </span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span>
              <span className="font-medium tabular-nums text-foreground">{commentsCount}</span>{" "}
              qualitative comments
            </span>
            {pipelineStatus ? (
              <>
                <span aria-hidden className="text-border">
                  ·
                </span>
                <PipelineStatusBadge status={pipelineStatus} />
              </>
            ) : null}
          </div>
        </div>

        {/* RIGHT: sentiment distribution */}
        {hasSentimentData ? (
          <div className="w-full max-w-sm lg:w-80">
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              Sentiment distribution
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Click a segment to filter comments below.
            </p>

            <div
              className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted"
              role="group"
              aria-label="Sentiment distribution"
            >
              {SEGMENT_ORDER.map((sentiment) => {
                const count = sentimentDistribution![sentiment];
                if (count === 0) return null;
                const widthPct = (count / totalSentiment) * 100;
                const isActive = sentimentFilter === sentiment;
                return (
                  <button
                    key={sentiment}
                    type="button"
                    onClick={() => onSentimentClick(isActive ? null : sentiment)}
                    className={cn(
                      "h-full transition-all hover:brightness-110",
                      SENTIMENT_SOLID_CLASS[sentiment],
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      isActive ? "brightness-110 ring-2 ring-ring ring-offset-1" : "",
                      sentimentFilter && !isActive ? "opacity-40" : ""
                    )}
                    style={{ width: `${widthPct}%` }}
                    aria-label={`Filter comments to ${SENTIMENT_LABEL[sentiment].toLowerCase()} sentiment, ${count} submissions`}
                    aria-pressed={isActive}
                  />
                );
              })}
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
              {SEGMENT_ORDER.map((sentiment) => {
                const count = sentimentDistribution![sentiment];
                const pct = Math.round((count / totalSentiment) * 100);
                return (
                  <div key={sentiment} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span
                        className={cn(
                          "inline-block h-2 w-2 rounded-full",
                          SENTIMENT_SOLID_CLASS[sentiment]
                        )}
                      />
                      <span>{SENTIMENT_LABEL[sentiment]}</span>
                    </div>
                    <div className="text-xl font-semibold leading-none tabular-nums text-foreground">
                      {count}
                    </div>
                    <div className="tabular-nums text-muted-foreground">{pct}%</div>
                  </div>
                );
              })}
            </dl>
          </div>
        ) : null}
      </div>

      {/* Filter chips tethered to the hero */}
      {hasActiveFilter ? (
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border/70 pt-5">
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            Filtering
          </span>
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
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={onClearAll}
          >
            Clear all
          </Button>
        </div>
      ) : null}
    </header>
  );
}
