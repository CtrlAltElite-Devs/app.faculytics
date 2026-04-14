"use client";

import { useMemo } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  ActionPriority,
  RecommendationsResponse,
  RecommendedActionDto,
  TopicSource,
} from "@/features/faculty-analytics/types";

type RecommendationsCardProps = {
  recommendations: RecommendationsResponse;
};

const PRIORITY_VARIANT: Record<
  ActionPriority,
  "default" | "secondary" | "destructive" | "outline"
> = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "outline",
};

function ActionItem({ action }: { action: RecommendedActionDto }) {
  const topicSources = action.supportingEvidence?.sources.filter(
    (s): s is TopicSource => s.type === "topic"
  );
  const evidenceKey = `evidence-${action.id}`;

  return (
    <div className="rounded-xl border border-border/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-playfair text-base font-semibold text-foreground">{action.headline}</h3>
        <Badge variant={PRIORITY_VARIANT[action.priority]}>{action.priority}</Badge>
      </div>
      <p className="mt-2 font-sans text-sm text-muted-foreground">{action.description}</p>
      <p className="mt-3 font-sans text-sm text-foreground">
        <span className="font-medium">Plan: </span>
        {action.actionPlan}
      </p>

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

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  const { strengths, improvements } = useMemo(() => {
    const strengths: RecommendedActionDto[] = [];
    const improvements: RecommendedActionDto[] = [];
    for (const action of recommendations.actions) {
      if (action.category === "STRENGTH") strengths.push(action);
      else improvements.push(action);
    }
    return { strengths, improvements };
  }, [recommendations.actions]);

  if (recommendations.actions.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Recommendations</CardTitle>
        <CardDescription>
          Generated insights from faculty feedback, grouped by category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="improvements">
          <TabsList>
            <TabsTrigger value="improvements">Improvements · {improvements.length}</TabsTrigger>
            <TabsTrigger value="strengths">Strengths · {strengths.length}</TabsTrigger>
          </TabsList>
          <TabsContent value="improvements" className="mt-4 space-y-3">
            {improvements.map((action) => (
              <ActionItem key={action.id} action={action} />
            ))}
            {improvements.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">
                No improvement actions identified.
              </p>
            ) : null}
          </TabsContent>
          <TabsContent value="strengths" className="mt-4 space-y-3">
            {strengths.map((action) => (
              <ActionItem key={action.id} action={action} />
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
