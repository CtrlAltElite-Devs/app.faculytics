export * from "@/features/dean/types";
export { fetchFacultyList } from "@/features/dean/api/dean.requests";
export { useFacultyList } from "@/features/dean/hooks/use-faculty-list";
export {
  deanAnalyticsSampleData,
  getDeanFacultyAnalysisBySlug,
} from "@/features/dean/lib/analytics-sample-data";
export type { DeanFacultyAnalysisRecord } from "@/features/dean/lib/analytics-sample-data";
