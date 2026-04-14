"use client";

import { Badge } from "@/components/ui/badge";
import type { PipelineStatus } from "@/features/faculty-analytics/types";

type PipelineStatusBadgeProps = {
  status: PipelineStatus;
  className?: string;
};

const LABELS: Record<PipelineStatus, string> = {
  AWAITING_CONFIRMATION: "Awaiting confirmation",
  EMBEDDING_CHECK: "Checking embeddings",
  SENTIMENT_ANALYSIS: "Analyzing sentiment",
  SENTIMENT_GATE: "Filtering results",
  TOPIC_MODELING: "Extracting themes",
  GENERATING_RECOMMENDATIONS: "Generating recommendations",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

const VARIANTS: Record<
  PipelineStatus,
  "default" | "secondary" | "destructive" | "outline" | "ghost"
> = {
  AWAITING_CONFIRMATION: "secondary",
  EMBEDDING_CHECK: "default",
  SENTIMENT_ANALYSIS: "default",
  SENTIMENT_GATE: "default",
  TOPIC_MODELING: "default",
  GENERATING_RECOMMENDATIONS: "default",
  COMPLETED: "default",
  FAILED: "destructive",
  CANCELLED: "outline",
};

export function PipelineStatusBadge({ status, className }: PipelineStatusBadgeProps) {
  return (
    <Badge variant={VARIANTS[status]} className={className}>
      {LABELS[status]}
    </Badge>
  );
}
