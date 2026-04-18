"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { PaginationFooter } from "@/components/shared/pagination-footer";
import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import { ScopedAnalyticsErrorState } from "@/features/faculty-analytics/components/scoped-analytics-error-state";
import { ScopedAnalyticsLoadingState } from "@/features/faculty-analytics/components/scoped-analytics-loading-state";
import {
  SENTIMENT_BADGE_CLASS,
  SENTIMENT_LABEL,
} from "@/features/faculty-analytics/lib/sentiment-colors";
import { cn } from "@/lib/utils";
import type {
  FacultyReportCommentDto,
  PaginationMetaDto,
  QualitativeThemeDto,
} from "@/features/faculty-analytics/types";
import { formatDateTime } from "@/lib/date";

type FacultyReportCommentsProps = {
  comments: FacultyReportCommentDto[];
  commentsMeta: PaginationMetaDto | null;
  commentsPage: number;
  commentsLimit: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  themes?: QualitativeThemeDto[];
};

export function FacultyReportComments({
  comments,
  commentsMeta,
  commentsPage,
  commentsLimit,
  isLoading,
  isError,
  onRetry,
  onPageChange,
  onRowsPerPageChange,
  themes,
}: FacultyReportCommentsProps) {
  const themeLookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const theme of themes ?? []) {
      map.set(theme.themeId, theme.label);
    }
    return map;
  }, [themes]);
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/70 px-5 py-4">
        <h2 className="font-playfair text-xl font-semibold text-foreground">
          Qualitative Comments
        </h2>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Student comments for the selected faculty report context.
        </p>
      </div>

      {isLoading ? (
        <div className="px-5 py-8">
          <ScopedAnalyticsLoadingState message="Loading qualitative comments..." />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <div className="px-5 py-8">
          <ScopedAnalyticsErrorState
            onRetry={onRetry}
            message="Unable to load qualitative comments."
          />
        </div>
      ) : null}

      {!isLoading && !isError && comments.length === 0 ? (
        <div className="px-5 py-8">
          <ScopedAnalyticsEmptyState description="No qualitative comments were submitted for this report context." />
        </div>
      ) : null}

      {!isLoading && !isError && comments.length > 0 ? (
        <div className="space-y-2 px-5 py-3">
          {comments.map((comment, index) => {
            const themeChipLabels = (comment.themeIds ?? [])
              .map((id) => themeLookup.get(id))
              .filter((label): label is string => Boolean(label));
            const visibleThemes = themeChipLabels.slice(0, 2);
            const overflowCount = themeChipLabels.length - visibleThemes.length;

            return (
              <article
                key={`${comment.submittedAt}-${index}`}
                className="rounded-2xl border border-border/70 bg-background/60 px-4 py-2.5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {comment.sentiment ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-2 py-0.5 font-sans text-[0.7rem]",
                            SENTIMENT_BADGE_CLASS[comment.sentiment]
                          )}
                        >
                          {SENTIMENT_LABEL[comment.sentiment]}
                        </Badge>
                      ) : null}
                      {visibleThemes.map((label) => (
                        <Badge
                          key={label}
                          variant="secondary"
                          className="rounded-full px-2 py-0.5 font-sans text-[0.7rem]"
                        >
                          {label}
                        </Badge>
                      ))}
                      {overflowCount > 0 ? (
                        <Badge
                          variant="outline"
                          className="rounded-full px-2 py-0.5 font-sans text-[0.7rem] text-muted-foreground"
                        >
                          +{overflowCount} more
                        </Badge>
                      ) : null}
                    </div>
                    <p className="max-w-3xl font-sans text-sm leading-6 text-foreground">
                      {comment.text}
                    </p>
                  </div>
                  <p className="shrink-0 font-sans text-xs text-muted-foreground sm:text-right">
                    Submitted {formatDateTime(comment.submittedAt)}
                  </p>
                </div>
              </article>
            );
          })}

          <PaginationFooter
            itemCount={commentsMeta?.itemCount ?? 0}
            totalItems={commentsMeta?.totalItems ?? 0}
            currentPage={commentsMeta?.currentPage ?? commentsPage}
            totalPages={commentsMeta?.totalPages ?? 1}
            itemLabel="comments"
            rowsPerPage={commentsLimit}
            onRowsPerPageChange={onRowsPerPageChange}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </section>
  );
}
