"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PipelineTriggerCard } from "@/features/faculty-analytics/components/pipeline-trigger-card";
import { RecommendationsCard } from "@/features/faculty-analytics/components/recommendations-card";
import { ScopedAttentionCard } from "@/features/faculty-analytics/components/scoped-attention-card";
import { ScopedOverallSentimentBarChart } from "@/features/faculty-analytics/components/scoped-charts";
import { ScopedMetricsGrid } from "@/features/faculty-analytics/components/scoped-metrics-grid";
import { ThemesRankedList } from "@/features/faculty-analytics/components/themes-ranked-list";
import type { DepartmentDashboardSectionsProps } from "@/features/faculty-analytics/components/scoped-dashboard-section-types";

function EmptyThemesPlaceholder() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Top Themes</CardTitle>
        <CardDescription>Ranked by comment volume with sentiment breakdown.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 text-center">
          <p className="max-w-sm font-sans text-sm text-muted-foreground">
            Run analysis to surface the strongest feedback themes for this scope.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyRecommendationsPlaceholder() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Suggested Actions</CardTitle>
        <CardDescription>Concrete actions informed by the feedback themes above.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 text-center">
          <p className="max-w-sm font-sans text-sm text-muted-foreground">
            Suggested actions will appear here after a completed analysis run.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DepartmentDashboardSections({
  summary,
  overallSentiment,
  attentionItems,
  isAttentionLoading,
  hasAnalyticsData,
  scopeLabel,
  facultiesHref,
  selectedSemesterId,
  selectedSemesterLabel,
  latestPipeline,
  showPipelineTrigger,
  themes,
  showRecommendationPanels,
  showEmptyInsightsPlaceholder,
  recommendations,
}: DepartmentDashboardSectionsProps) {
  return (
    <>
      {showPipelineTrigger && selectedSemesterId ? (
        <PipelineTriggerCard scope={{ semesterId: selectedSemesterId }} pipeline={latestPipeline} />
      ) : null}

      <ScopedMetricsGrid summary={summary} />

      <div className="grid gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ScopedOverallSentimentBarChart overallSentiment={overallSentiment} />
        {showRecommendationPanels ? (
          <ThemesRankedList themes={themes} />
        ) : showEmptyInsightsPlaceholder ? (
          <EmptyThemesPlaceholder />
        ) : null}
      </div>

      <div className="grid gap-6 min-[900px]:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
        <ScopedAttentionCard
          items={attentionItems}
          isLoading={isAttentionLoading}
          hasAnalyticsData={hasAnalyticsData}
          scopeLabel={scopeLabel}
          facultiesHref={facultiesHref}
          semesterId={selectedSemesterId ?? ""}
          semesterLabel={selectedSemesterLabel}
        />
        {showRecommendationPanels && recommendations ? (
          <RecommendationsCard recommendations={recommendations} />
        ) : showEmptyInsightsPlaceholder ? (
          <EmptyRecommendationsPlaceholder />
        ) : null}
      </div>
    </>
  );
}
