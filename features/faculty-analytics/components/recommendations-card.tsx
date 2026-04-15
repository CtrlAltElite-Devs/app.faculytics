"use client";

import { useMemo } from "react";
import { ArrowUp } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  filterActionsByFacet,
  formatFacetLabel,
} from "@/features/faculty-analytics/lib/facet-filter";
import { recommendationAnchorId } from "@/features/faculty-analytics/lib/theme-anchor";
import type {
  ActionPriority,
  Facet,
  RecommendationsResponse,
  RecommendedActionDto,
  TopicSource,
  VoiceBreakdown,
} from "@/features/faculty-analytics/types";

type RecommendationsCardProps = {
  recommendations: RecommendationsResponse;
  onViewTheme?: (topicLabel: string) => void;
  // FAC-135 Phase C (Task C8): facet selection + voice breakdown drive the
  // three-way empty-state discrimination.
  selectedFacet?: Facet;
  voiceBreakdown?: VoiceBreakdown | null;
};

const PRIORITY_VARIANT: Record<
  ActionPriority,
  "default" | "secondary" | "destructive" | "outline"
> = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "outline",
};

function extractTopicLabel(action: RecommendedActionDto): string | null {
  const topicSource = action.supportingEvidence?.sources.find(
    (s): s is TopicSource => s.type === "topic"
  );
  return topicSource?.topicLabel ?? null;
}

function ActionItem({
  action,
  onViewTheme,
}: {
  action: RecommendedActionDto;
  onViewTheme?: (topicLabel: string) => void;
}) {
  const topicSources = action.supportingEvidence?.sources.filter(
    (s): s is TopicSource => s.type === "topic"
  );
  const evidenceKey = `evidence-${action.id}`;
  const primaryTopicLabel = extractTopicLabel(action);
  const anchorId = recommendationAnchorId(primaryTopicLabel ?? action.id);

  return (
    <div
      id={anchorId}
      className="rounded-xl border border-border/70 p-4 data-[highlight=pulse]:animate-pulse data-[highlight=pulse]:bg-amber-100/60"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-playfair text-base font-semibold text-foreground">{action.headline}</h3>
        <Badge variant={PRIORITY_VARIANT[action.priority]}>{action.priority}</Badge>
      </div>
      <p className="mt-2 font-sans text-sm text-muted-foreground">{action.description}</p>
      <p className="mt-3 font-sans text-sm text-foreground">
        <span className="font-medium">Plan: </span>
        {action.actionPlan}
      </p>

      {primaryTopicLabel && onViewTheme ? (
        <div className="mt-3">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 font-sans text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onViewTheme(primaryTopicLabel)}
          >
            <ArrowUp className="mr-1 h-3 w-3" />
            View theme
          </Button>
        </div>
      ) : null}

      {topicSources && topicSources.length > 0 ? (
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem value={evidenceKey}>
            <AccordionTrigger className="text-sm">Evidence</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 font-sans text-sm">
                {topicSources.map((source) => (
                  <li key={source.topicLabel} className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{source.topicLabel}</span>
                      <span className="text-xs text-muted-foreground">
                        {source.commentCount} mention
                        {source.commentCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    {source.sampleQuotes.length > 0 ? (
                      <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
                        {source.sampleQuotes.map((quote, idx) => (
                          <li key={`${source.topicLabel}-${idx}`}>{quote}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
    </div>
  );
}

function EmptyStateCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Suggested Actions</CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-sans text-sm text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}

export function RecommendationsCard({
  recommendations,
  onViewTheme,
  selectedFacet,
  voiceBreakdown,
}: RecommendationsCardProps) {
  // FAC-135 Phase C (Task C8): filter actions by the selected facet.
  // Default to 'overall' when the caller doesn't pass a facet (back-compat
  // for the scoped dashboard which doesn't expose facet tabs yet).
  const effectiveFacet: Facet = selectedFacet ?? "overall";
  const filteredActions = useMemo(
    () => filterActionsByFacet(recommendations.actions, effectiveFacet),
    [recommendations.actions, effectiveFacet]
  );

  const { strengths, improvements } = useMemo(() => {
    const strengths: RecommendedActionDto[] = [];
    const improvements: RecommendedActionDto[] = [];
    for (const action of filteredActions) {
      if (action.category === "STRENGTH") strengths.push(action);
      else improvements.push(action);
    }
    return { strengths, improvements };
  }, [filteredActions]);

  // Three-way empty-state discrimination (AC40):
  // 1) Genuine empty — no submissions of this facet's questionnaire type.
  // 2) Data present but no actions — analysis in progress or unavailable.
  // 3) Data + actions present — normal render.
  if (filteredActions.length === 0) {
    // Distinguish (1) from (2) only when voiceBreakdown is available AND
    // we're viewing a specific facet. For 'overall' or missing breakdown,
    // fall back to the generic empty handling (return null, preserving
    // existing pre-FAC-135 behaviour).
    if (voiceBreakdown && effectiveFacet !== "overall") {
      const submissionCount = voiceBreakdown[effectiveFacet].submissionCount;
      if (submissionCount === 0) {
        return (
          <EmptyStateCard
            title={`No ${formatFacetLabel(effectiveFacet)} data yet`}
            body={`There are no ${formatFacetLabel(effectiveFacet)} submissions for this semester yet. Recommendations will appear once data is collected.`}
          />
        );
      }
      return (
        <EmptyStateCard
          title="Analysis still in progress or unavailable"
          body="Submissions were received for this view, but no recommendations are available yet. If this persists, contact your administrator."
        />
      );
    }
    return null;
  }

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Suggested Actions</CardTitle>
        <CardDescription>Concrete actions informed by the feedback themes above.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="improvements">
          <TabsList>
            <TabsTrigger value="improvements">Improvements · {improvements.length}</TabsTrigger>
            <TabsTrigger value="strengths">Strengths · {strengths.length}</TabsTrigger>
          </TabsList>
          <TabsContent value="improvements" className="mt-4 space-y-3">
            {improvements.map((action) => (
              <ActionItem key={action.id} action={action} onViewTheme={onViewTheme} />
            ))}
            {improvements.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">
                No improvement actions identified.
              </p>
            ) : null}
          </TabsContent>
          <TabsContent value="strengths" className="mt-4 space-y-3">
            {strengths.map((action) => (
              <ActionItem key={action.id} action={action} onViewTheme={onViewTheme} />
            ))}
            {strengths.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">
                No strength actions identified.
              </p>
            ) : null}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
