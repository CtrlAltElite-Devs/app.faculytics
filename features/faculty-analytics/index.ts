export * from "@/features/faculty-analytics/types";
export { DeanFacultyAnalysisTable } from "@/features/faculty-analytics/components/dean-faculty-analysis-table";
export { DeanDashboardScreen } from "@/features/faculty-analytics/components/dean-dashboard-screen";
export { DeanFacultyAnalyticsScreen } from "@/features/faculty-analytics/components/dean-faculty-analytics-screen";
export {
  getDeanDashboardViewModel,
  getDeanFacultyAnalysisDetailViewModel,
  getDeanFacultyAnalyticsListViewModel,
} from "@/features/faculty-analytics/lib/dean-analytics-view-model";
export type { DeanFacultyAnalysisRecord } from "@/features/faculty-analytics/lib/analytics-sample-data";
