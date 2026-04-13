"use client";

import { PaginationFooter } from "@/components/shared/pagination-footer";
import { DeanAnalyticsEmptyState } from "@/features/faculty-analytics/components/dean-analytics-empty-state";
import { DeanAnalyticsErrorState } from "@/features/faculty-analytics/components/dean-analytics-error-state";
import { DeanAnalyticsLoadingState } from "@/features/faculty-analytics/components/dean-analytics-loading-state";
import type {
  FacultyReportCommentDto,
  PaginationMetaDto,
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
}: FacultyReportCommentsProps) {
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
          <DeanAnalyticsLoadingState message="Loading qualitative comments..." />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <div className="px-5 py-8">
          <DeanAnalyticsErrorState
            onRetry={onRetry}
            message="Unable to load qualitative comments."
          />
        </div>
      ) : null}

      {!isLoading && !isError && comments.length === 0 ? (
        <div className="px-5 py-8">
          <DeanAnalyticsEmptyState description="No qualitative comments were submitted for this report context." />
        </div>
      ) : null}

      {!isLoading && !isError && comments.length > 0 ? (
        <div className="space-y-2 px-5 py-3">
          {comments.map((comment, index) => (
            <article
              key={`${comment.submittedAt}-${index}`}
              className="rounded-2xl border border-border/70 bg-background/60 px-4 py-2.5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <p className="max-w-3xl font-sans text-sm leading-6 text-foreground">
                  {comment.text}
                </p>
                <p className="shrink-0 font-sans text-xs text-muted-foreground sm:text-right">
                  Submitted {formatDateTime(comment.submittedAt)}
                </p>
              </div>
            </article>
          ))}

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
