import type { PipelineStageStatus, PipelineStatus } from "@/features/faculty-analytics/types";

export type StageKey =
  | "embeddings"
  | "sentiment"
  | "sentimentGate"
  | "topicModeling"
  | "recommendations";

export const STAGE_ORDER: readonly StageKey[] = [
  "embeddings",
  "sentiment",
  "sentimentGate",
  "topicModeling",
  "recommendations",
] as const;

export const STAGE_LABELS: Record<StageKey, string> = {
  embeddings: "Embedding check",
  sentiment: "Sentiment analysis",
  sentimentGate: "Sentiment gate",
  topicModeling: "Topic modeling",
  recommendations: "Recommendations",
};

export const STAGE_DESCRIPTIONS: Record<StageKey, string> = {
  embeddings: "Backfilling vector embeddings for each comment",
  sentiment: "Classifying each comment as positive, neutral, or negative",
  sentimentGate: "Filtering comments that qualify for topic modeling",
  topicModeling: "Clustering qualifying comments into themes",
  recommendations: "Generating LLM-powered action plans",
};

export const STATUS_HEADLINE: Record<PipelineStatus, string> = {
  AWAITING_CONFIRMATION: "Awaiting confirmation",
  EMBEDDING_CHECK: "Checking embeddings",
  SENTIMENT_ANALYSIS: "Analyzing sentiment",
  SENTIMENT_GATE: "Filtering comments",
  TOPIC_MODELING: "Extracting themes",
  GENERATING_RECOMMENDATIONS: "Generating recommendations",
  COMPLETED: "Analysis complete",
  FAILED: "Analysis failed",
  CANCELLED: "Analysis cancelled",
};

export const TERMINAL_STATUSES: ReadonlySet<PipelineStatus> = new Set<PipelineStatus>([
  "COMPLETED",
  "FAILED",
  "CANCELLED",
]);

export const RUNNING_STATUSES: ReadonlySet<PipelineStatus> = new Set<PipelineStatus>([
  "EMBEDDING_CHECK",
  "SENTIMENT_ANALYSIS",
  "SENTIMENT_GATE",
  "TOPIC_MODELING",
  "GENERATING_RECOMMENDATIONS",
]);

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remSeconds = seconds % 60;
  if (minutes < 60) {
    return remSeconds === 0
      ? `${minutes}m`
      : `${minutes}m ${remSeconds.toString().padStart(2, "0")}s`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours}h ${remMinutes.toString().padStart(2, "0")}m`;
}

export function stageElapsedLabel(stage: PipelineStageStatus): string | null {
  if (!stage.startedAt) return null;
  const start = new Date(stage.startedAt).getTime();
  const end = stage.completedAt ? new Date(stage.completedAt).getTime() : Date.now();
  return formatDuration(end - start);
}

export function overallElapsedLabel(createdAt: string, completedAt: string | null): string {
  const start = new Date(createdAt).getTime();
  const end = completedAt ? new Date(completedAt).getTime() : Date.now();
  return formatDuration(end - start);
}

export function activeStageIndex(stages: Record<StageKey, PipelineStageStatus>): number {
  const processing = STAGE_ORDER.findIndex((key) => stages[key].status === "processing");
  if (processing !== -1) return processing;
  const pending = STAGE_ORDER.findIndex((key) => stages[key].status === "pending");
  if (pending !== -1) return pending;
  return STAGE_ORDER.length;
}
