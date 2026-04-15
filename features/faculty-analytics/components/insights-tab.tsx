"use client";

import { useMemo } from "react";

import { AutoCorrectionNotice } from "@/features/faculty-analytics/components/auto-correction-notice";
import { FacultyAnalysisSentimentStrip } from "@/features/faculty-analytics/components/faculty-analysis-sentiment-strip";
import { FacultyReportComments } from "@/features/faculty-analytics/components/faculty-report-comments";
import { RecommendationsCard } from "@/features/faculty-analytics/components/recommendations-card";
import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import { ThemeExplorerList } from "@/features/faculty-analytics/components/theme-explorer-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FACET_ORDER,
  deriveThemeFacets,
  filterThemesByFacet,
  formatFacetLabel,
} from "@/features/faculty-analytics/lib/facet-filter";
import type {
  Facet,
  FacultyReportCommentDto,
  PaginationMetaDto,
  PipelineStatus,
  QualitativeSummaryResponseDto,
  RecommendationsResponse,
  SentimentLabel,
  VoiceBreakdown,
} from "@/features/faculty-analytics/types";
import type { ParamAutoCorrection } from "@/features/faculty-analytics/hooks/use-faculty-report-detail-view-model";

type InsightsTabProps = {
  facultyId: string;
  semesterId: string;
  questionnaireTypeCode: string | null;
  selectedFacet: Facet;
  onFacetChange: (facet: Facet) => void;
  voiceBreakdown: VoiceBreakdown | null;
  qualitativeSummary: QualitativeSummaryResponseDto | undefined;
  recommendations: RecommendationsResponse | undefined;
  livePipelineStatus: PipelineStatus | undefined;
  showSentimentSurface: boolean;
  showThemesSurface: boolean;
  sentimentFilter: SentimentLabel | null;
  themeLabelFilter: string | null;
  onSentimentClick: (next: SentimentLabel | null) => void;
  onThemeClick: (label: string | null) => void;
  onClearAllFilters: () => void;
  comments: FacultyReportCommentDto[];
  commentsMeta: PaginationMetaDto | null;
  commentsPage: number;
  commentsLimit: number;
  isCommentsLoading: boolean;
  isCommentsError: boolean;
  onCommentsRetry: () => void;
  onCommentsPageChange: (page: number) => void;
  onCommentsRowsPerPageChange: (value: number) => void;
  themeLabelAutoCorrection: ParamAutoCorrection | null;
  onDismissThemeLabelAutoCorrection: () => void;
};

function countForFacet(voiceBreakdown: VoiceBreakdown | null | undefined, facet: Facet): number {
  if (!voiceBreakdown) return 0;
  if (facet === "overall") {
    return (
      voiceBreakdown.facultyFeedback.submissionCount +
      voiceBreakdown.inClassroom.submissionCount +
      voiceBreakdown.outOfClassroom.submissionCount +
      voiceBreakdown.other.submissionCount
    );
  }
  return voiceBreakdown[facet].submissionCount;
}

export function InsightsTab({
  facultyId,
  semesterId,
  questionnaireTypeCode,
  selectedFacet,
  onFacetChange,
  voiceBreakdown,
  qualitativeSummary,
  recommendations,
  livePipelineStatus,
  showSentimentSurface,
  showThemesSurface,
  sentimentFilter,
  themeLabelFilter,
  onSentimentClick,
  onThemeClick,
  onClearAllFilters,
  comments,
  commentsMeta,
  commentsPage,
  commentsLimit,
  isCommentsLoading,
  isCommentsError,
  onCommentsRetry,
  onCommentsPageChange,
  onCommentsRowsPerPageChange,
  themeLabelAutoCorrection,
  onDismissThemeLabelAutoCorrection,
}: InsightsTabProps) {
  const themes = useMemo(() => qualitativeSummary?.themes ?? [], [qualitativeSummary?.themes]);
  const actions = useMemo(() => recommendations?.actions ?? [], [recommendations?.actions]);
  const themeFacets = useMemo(() => deriveThemeFacets(themes, actions), [themes, actions]);
  const visibleThemes = useMemo(
    () => filterThemesByFacet(themes, themeFacets, selectedFacet),
    [themes, themeFacets, selectedFacet]
  );

  const pipelineNotRun = !livePipelineStatus;

  return (
    <div className="space-y-6">
      {themeLabelAutoCorrection ? (
        <AutoCorrectionNotice
          requested={themeLabelAutoCorrection.requested}
          actual={themeLabelAutoCorrection.actual}
          paramLabel="topic"
          onDismiss={onDismissThemeLabelAutoCorrection}
        />
      ) : null}

      <Tabs
        value={selectedFacet}
        onValueChange={(value) => onFacetChange(value as Facet)}
        className="w-full"
      >
        <TabsList className="flex h-auto w-full flex-wrap gap-1 sm:w-auto">
          {FACET_ORDER.map((facet) => {
            const count = countForFacet(voiceBreakdown, facet);
            return (
              <TabsTrigger key={facet} value={facet} className="font-sans text-xs">
                {formatFacetLabel(facet)}
                {voiceBreakdown ? (
                  <span className="ml-1.5 text-[10px] tabular-nums text-muted-foreground">
                    · {count}
                  </span>
                ) : null}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {showSentimentSurface && qualitativeSummary ? (
        <FacultyAnalysisSentimentStrip
          distribution={qualitativeSummary.sentimentDistribution}
          sentimentFilter={sentimentFilter}
          themeLabelFilter={themeLabelFilter}
          onSentimentClick={onSentimentClick}
          onClearSentiment={() => onSentimentClick(null)}
          onClearTheme={() => onThemeClick(null)}
          onClearAll={onClearAllFilters}
        />
      ) : null}

      {showThemesSurface && visibleThemes.length > 0 ? (
        <section className="space-y-6">
          <p className="max-w-3xl text-xs text-muted-foreground">
            Themes and feedback are analyzed across all your courses to ensure reliable patterns.
            Per-course breakdowns show quantitative ratings only.
          </p>
          <ThemeExplorerList
            themes={visibleThemes}
            expandedThemeLabel={themeLabelFilter}
            onToggleTheme={onThemeClick}
            facultyId={facultyId}
            semesterId={semesterId}
            questionnaireTypeCode={questionnaireTypeCode ?? ""}
            sentimentFilter={sentimentFilter}
            actions={actions}
          />
          {recommendations ? (
            <RecommendationsCard
              recommendations={recommendations}
              selectedFacet={selectedFacet}
              voiceBreakdown={voiceBreakdown}
            />
          ) : null}
        </section>
      ) : showThemesSurface && themes.length === 0 && comments.length > 0 ? (
        <section>
          <div className="max-w-3xl">
            <h2 className="font-playfair text-xl font-semibold tracking-tight text-foreground">
              Student comments
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No themes clustered from this analysis. The raw comments are below.
            </p>
          </div>
          <div className="mt-4">
            <FacultyReportComments
              comments={comments}
              commentsMeta={commentsMeta}
              commentsPage={commentsPage}
              commentsLimit={commentsLimit}
              isLoading={isCommentsLoading}
              isError={isCommentsError}
              onRetry={onCommentsRetry}
              onPageChange={onCommentsPageChange}
              onRowsPerPageChange={onCommentsRowsPerPageChange}
            />
          </div>
        </section>
      ) : showSentimentSurface ? (
        <section className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Sentiment analysis is ready. Themes and suggested actions will surface shortly.
          </p>
        </section>
      ) : pipelineNotRun ? (
        <ScopedAnalyticsEmptyState description="Run qualitative analysis to surface sentiment, themes, and recommended actions for this faculty member." />
      ) : null}
    </div>
  );
}
