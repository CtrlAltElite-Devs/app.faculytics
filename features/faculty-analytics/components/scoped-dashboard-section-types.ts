"use client";

import type { useLatestPipelineForScope } from "@/features/faculty-analytics/hooks/use-latest-pipeline-for-scope";
import type { usePipelineRecommendations } from "@/features/faculty-analytics/hooks/use-pipeline-recommendations";
import type { useScopedAnalyticsDashboardViewModel } from "@/features/faculty-analytics/hooks/use-scoped-analytics-dashboard-view-model";
import type { QualitativeThemeDto } from "@/features/faculty-analytics/types";

export type ScopeLabel = "Campus" | "Department" | "Program";

export type DashboardCommonSectionProps = {
  summary: ReturnType<typeof useScopedAnalyticsDashboardViewModel>["summary"];
  overallSentiment: ReturnType<typeof useScopedAnalyticsDashboardViewModel>["overallSentiment"];
  attentionItems: ReturnType<typeof useScopedAnalyticsDashboardViewModel>["attentionItems"];
  isAttentionLoading: boolean;
  hasAnalyticsData: boolean;
  scopeLabel: ScopeLabel;
  facultiesHref: string;
  selectedSemesterId: string | null;
  selectedSemesterLabel: string;
};

export type DepartmentDashboardSectionsProps = DashboardCommonSectionProps & {
  latestPipeline: ReturnType<typeof useLatestPipelineForScope>["latestPipeline"];
  showPipelineTrigger: boolean;
  themes: QualitativeThemeDto[];
  showRecommendationPanels: boolean;
  showEmptyInsightsPlaceholder: boolean;
  recommendations: ReturnType<typeof usePipelineRecommendations>["data"];
};
