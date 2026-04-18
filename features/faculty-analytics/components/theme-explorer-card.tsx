"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronRight, Lightbulb, Quote } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PaginationFooter } from "@/components/shared/pagination-footer";
import { ScopedAnalyticsErrorState } from "@/features/faculty-analytics/components/scoped-analytics-error-state";
import { ScopedAnalyticsLoadingState } from "@/features/faculty-analytics/components/scoped-analytics-loading-state";
import { useFacultyReportComments } from "@/features/faculty-analytics/hooks/use-faculty-report-comments";
import {
  SENTIMENT_BADGE_CLASS,
  SENTIMENT_LABEL,
  SENTIMENT_SOLID_CLASS,
} from "@/features/faculty-analytics/lib/sentiment-colors";
import { themeRowAnchorId } from "@/features/faculty-analytics/lib/theme-anchor";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/date";
import type {
  ActionPriority,
  QualitativeThemeDto,
  RecommendedActionDto,
  SentimentLabel,
} from "@/features/faculty-analytics/types";

type ThemeExplorerCardProps = {
  theme: QualitativeThemeDto;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
  facultyId: string;
  semesterId: string;
  questionnaireTypeCode: string;
  sentimentFilter: SentimentLabel | null;
  matchingAction: RecommendedActionDto | null;
  redactComments?: boolean;
};

const PRIORITY_VARIANT: Record<
  ActionPriority,
  "default" | "secondary" | "destructive" | "outline"
> = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "outline",
};

function dominantSentiment(theme: QualitativeThemeDto): SentimentLabel {
  const { positive, neutral, negative } = theme.sentimentSplit;
  if (negative >= positive && negative >= neutral) return "negative";
  if (positive >= neutral) return "positive";
  return "neutral";
}

export function ThemeExplorerCard({
  theme,
  rank,
  isExpanded,
  onToggle,
  facultyId,
  semesterId,
  questionnaireTypeCode,
  sentimentFilter,
  matchingAction,
  redactComments,
}: ThemeExplorerCardProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [lastSentiment, setLastSentiment] = useState(sentimentFilter);
  const bodyRef = useRef<HTMLDivElement>(null);

  if (lastSentiment !== sentimentFilter) {
    setLastSentiment(sentimentFilter);
    setPage(1);
  }

  const commentsQuery = useFacultyReportComments(
    {
      facultyId,
      semesterId,
      questionnaireTypeCode,
      themeId: theme.themeId,
      sentiment: sentimentFilter ?? undefined,
      page,
      limit,
    },
    { enabled: isExpanded && !redactComments }
  );

  const dominant = dominantSentiment(theme);
  // FAC-135 Phase C (Task C12): when `sampleQuotes` is empty (server-side
  // redaction in Faculty self-view, or no quotes available) we don't render
  // a preview and surface a subtle note in the expanded body. Server is the
  // canonical gate; this is cosmetic handling of the empty shape.
  const hasSampleQuotes = (theme.sampleQuotes?.length ?? 0) > 0;
  const previewQuote = hasSampleQuotes ? theme.sampleQuotes![0] : null;

  const totalSplit =
    theme.sentimentSplit.positive + theme.sentimentSplit.neutral + theme.sentimentSplit.negative;

  const comments = commentsQuery.data?.items ?? [];
  const meta = commentsQuery.data?.meta ?? null;

  const segments = useMemo(
    () =>
      (["negative", "neutral", "positive"] as SentimentLabel[]).map((s) => ({
        key: s,
        count: theme.sentimentSplit[s],
        widthPct: totalSplit > 0 ? (theme.sentimentSplit[s] / totalSplit) * 100 : 0,
      })),
    [theme.sentimentSplit, totalSplit]
  );

  return (
    <article
      id={themeRowAnchorId(theme.label)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card transition-all",
        "data-[highlight=pulse]:animate-pulse data-[highlight=pulse]:bg-accent",
        isExpanded
          ? "border-border shadow-md"
          : "border-border/70 shadow-sm hover:border-border hover:shadow-md"
      )}
    >
      {/* dominant-sentiment accent rail */}
      <div
        aria-hidden
        className={cn("absolute left-0 top-0 h-full w-1", SENTIMENT_SOLID_CLASS[dominant])}
      />

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-5 px-6 pl-8 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-expanded={isExpanded}
        aria-controls={`theme-body-${theme.themeId}`}
      >
        {/* Rank numeral — the one place display font earns its keep */}
        <span
          aria-hidden
          className="mt-0.5 font-playfair text-xl font-medium text-muted-foreground/50 tabular-nums"
        >
          {String(rank).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{theme.label}</h3>
            <span className="text-xs tabular-nums text-muted-foreground">
              {theme.count} mention{theme.count === 1 ? "" : "s"}
            </span>
          </div>

          {/* Inline sentiment split micro-bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              {segments.map((s) =>
                s.count === 0 ? null : (
                  <span
                    key={s.key}
                    className={cn("h-full", SENTIMENT_SOLID_CLASS[s.key])}
                    style={{ width: `${s.widthPct}%` }}
                    aria-label={`${SENTIMENT_LABEL[s.key]}: ${s.count}`}
                  />
                )
              )}
            </div>
            <div className="flex gap-3 text-xs tabular-nums text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", SENTIMENT_SOLID_CLASS.negative)} />
                {theme.sentimentSplit.negative}
              </span>
              <span className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", SENTIMENT_SOLID_CLASS.neutral)} />
                {theme.sentimentSplit.neutral}
              </span>
              <span className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", SENTIMENT_SOLID_CLASS.positive)} />
                {theme.sentimentSplit.positive}
              </span>
            </div>
          </div>

          {/* Pull-quote preview (readable sans, not serif) */}
          {previewQuote && !isExpanded && !redactComments ? (
            <blockquote className="mt-4 border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{previewQuote}&rdquo;
            </blockquote>
          ) : null}
        </div>

        <span className="mt-1 flex items-center gap-1 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground group-hover:text-foreground">
          <span className="hidden sm:inline">{isExpanded ? "Collapse" : "Expand"}</span>
          <ChevronRight
            className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-90")}
          />
        </span>
      </button>

      <div
        id={`theme-body-${theme.themeId}`}
        ref={bodyRef}
        data-state={isExpanded ? "open" : "closed"}
        aria-hidden={!isExpanded}
        className="grid transition-[grid-template-rows] duration-300 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
      >
        <div className="overflow-hidden">
          <div className="border-t border-border/70 bg-muted/30 px-6 pl-8 pb-8 pt-6">
            <div
              className={cn(
                "grid gap-10",
                redactComments ? "lg:grid-cols-1" : "lg:grid-cols-[1fr_minmax(0,320px)]"
              )}
            >
              {/* LEFT — sample quotes + comments (hidden for faculty self-view) */}
              {!redactComments ? (
                <div className="min-w-0 space-y-8">
                  {hasSampleQuotes ? (
                    <section>
                      <h4 className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                        What students say
                      </h4>
                      <ul className="mt-4 space-y-4">
                        {theme.sampleQuotes!.map((quote, idx) => (
                          <li key={idx} className="relative border-l-2 border-foreground/20 pl-5">
                            <Quote
                              className="absolute -left-2 top-0 h-3.5 w-3.5 -translate-x-1/2 bg-muted px-0.5 text-muted-foreground"
                              aria-hidden
                            />
                            <p className="text-sm leading-relaxed text-foreground">{quote}</p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : (
                    // FAC-135 Phase C (Task C12): redacted / no-quotes path.
                    <p className="text-xs italic text-muted-foreground">
                      Individual comments are not available in your view.
                    </p>
                  )}

                  <section>
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                        All comments in this theme
                        {sentimentFilter ? (
                          <span className="ml-2 normal-case tracking-normal text-muted-foreground/70">
                            · filtered to {SENTIMENT_LABEL[sentimentFilter]}
                          </span>
                        ) : null}
                      </h4>
                      {meta ? (
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {meta.totalItems} total
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4">
                      {commentsQuery.isLoading ? (
                        <ScopedAnalyticsLoadingState message="Loading comments..." />
                      ) : commentsQuery.isError ? (
                        <ScopedAnalyticsErrorState
                          onRetry={() => void commentsQuery.refetch()}
                          message="Unable to load comments for this theme."
                        />
                      ) : comments.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-6 text-center text-sm text-muted-foreground">
                          No comments match the current filter in this theme.
                        </p>
                      ) : (
                        <>
                          <ul className="space-y-3">
                            {comments.map((c, idx) => (
                              <li
                                key={`${c.submittedAt}-${idx}`}
                                className="rounded-xl border border-border/70 bg-card px-4 py-3"
                              >
                                <div className="flex items-baseline justify-between gap-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {c.sentiment ? (
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-wider",
                                          SENTIMENT_BADGE_CLASS[c.sentiment]
                                        )}
                                      >
                                        {SENTIMENT_LABEL[c.sentiment]}
                                      </Badge>
                                    ) : null}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDateTime(c.submittedAt)}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-foreground">
                                  {c.text}
                                </p>
                              </li>
                            ))}
                          </ul>
                          {meta && meta.totalPages > 1 ? (
                            <div className="mt-5">
                              <PaginationFooter
                                itemCount={meta.itemCount}
                                totalItems={meta.totalItems}
                                currentPage={meta.currentPage}
                                totalPages={meta.totalPages}
                                itemLabel="comments"
                                rowsPerPage={limit}
                                onRowsPerPageChange={(n) => {
                                  setLimit(n);
                                  setPage(1);
                                }}
                                onPageChange={setPage}
                              />
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </section>
                </div>
              ) : null}

              {/* RIGHT — suggested action + meta */}
              <aside className="space-y-6">
                {matchingAction ? (
                  <section className="rounded-2xl border border-border/70 bg-accent/40 p-5">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-foreground/70" aria-hidden />
                      <h4 className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                        Suggested action
                      </h4>
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <h5 className="text-base font-semibold leading-tight text-foreground">
                        {matchingAction.headline}
                      </h5>
                      <Badge variant={PRIORITY_VARIANT[matchingAction.priority]}>
                        {matchingAction.priority}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {matchingAction.description}
                    </p>
                    <div className="mt-4 rounded-xl border border-border/70 bg-card p-3">
                      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                        Plan
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground">
                        {matchingAction.actionPlan}
                      </p>
                    </div>
                  </section>
                ) : (
                  <section className="rounded-2xl border border-dashed border-border bg-background/60 p-5">
                    <h4 className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Suggested action
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      No specific recommendation is tied to this theme yet.
                    </p>
                  </section>
                )}

                {!redactComments ? (
                  <section>
                    <h4 className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Sentiment breakdown
                    </h4>
                    <dl className="mt-4 space-y-3 text-sm">
                      {(["negative", "neutral", "positive"] as SentimentLabel[]).map((s) => {
                        const count = theme.sentimentSplit[s];
                        const pct = totalSplit > 0 ? Math.round((count / totalSplit) * 100) : 0;
                        return (
                          <div key={s} className="space-y-1">
                            <div className="flex items-center justify-between text-muted-foreground">
                              <span className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "inline-block h-2 w-2 rounded-full",
                                    SENTIMENT_SOLID_CLASS[s]
                                  )}
                                />
                                {SENTIMENT_LABEL[s]}
                              </span>
                              <span className="tabular-nums">
                                <span className="font-medium text-foreground">{count}</span>
                                <span className="text-muted-foreground/70"> · {pct}%</span>
                              </span>
                            </div>
                            <div className="h-1 overflow-hidden rounded-full bg-muted">
                              <span
                                className={cn("block h-full", SENTIMENT_SOLID_CLASS[s])}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </dl>
                  </section>
                ) : null}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
