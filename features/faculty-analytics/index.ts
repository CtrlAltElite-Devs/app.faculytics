export { ScopedAnalyticsDashboardScreen } from "@/features/faculty-analytics/components/scoped-analytics-dashboard-screen";
export type { ScopeLabel } from "@/features/faculty-analytics/components/scoped-analytics-dashboard-screen";
export { ScopedFacultyListScreen } from "@/features/faculty-analytics/components/scoped-faculty-list-screen";
export { FacultyReportScreen } from "@/features/faculty-analytics/components/faculty-report-screen";

// FAC-132: analysis pipeline surfaces
export { PipelineStatusBadge } from "@/features/faculty-analytics/components/pipeline-status-badge";
export { PipelineTriggerCard } from "@/features/faculty-analytics/components/pipeline-trigger-card";
export { PipelineConfirmDialog } from "@/features/faculty-analytics/components/pipeline-confirm-dialog";
export { PipelineStatusDialog } from "@/features/faculty-analytics/components/pipeline-status-dialog";
export { RecommendationsCard } from "@/features/faculty-analytics/components/recommendations-card";
export { ThemesChipList } from "@/features/faculty-analytics/components/themes-chip-list";
export { ThemesRankedList } from "@/features/faculty-analytics/components/themes-ranked-list";

export { useLatestPipelineForScope } from "@/features/faculty-analytics/hooks/use-latest-pipeline-for-scope";
export { usePipelineStatus } from "@/features/faculty-analytics/hooks/use-pipeline-status";
export { usePipelineRecommendations } from "@/features/faculty-analytics/hooks/use-pipeline-recommendations";
export { useCreatePipeline } from "@/features/faculty-analytics/hooks/use-create-pipeline";
export { useConfirmPipeline } from "@/features/faculty-analytics/hooks/use-confirm-pipeline";
export { useCancelPipeline } from "@/features/faculty-analytics/hooks/use-cancel-pipeline";

export {
  aggregateThemes,
  type RankedTheme,
} from "@/features/faculty-analytics/lib/pipeline-themes";

export type {
  PipelineStatus,
  PipelineScopeIds,
  PipelineScopeDisplay,
  PipelineCoverage,
  PipelineStageStatus,
  PipelineStatusResponse,
  PipelineSummary,
  CreatePipelineRequest,
  ListPipelinesQuery,
  RecommendationsResponse,
  RecommendedActionDto,
  SupportingEvidence,
  TopicSource,
  DimensionScoresSource,
  ActionCategory,
  ActionPriority,
  RunStatus,
} from "@/features/faculty-analytics/types";
