import {
  deanAnalyticsSampleData,
  getDeanFacultyAnalysisBySlug,
} from "@/features/faculty-analytics/lib/analytics-sample-data";
import type {
  DepartmentOverviewResponseDto,
  SemesterOptionDto,
} from "@/features/faculty-analytics/types";

export type DeanSemesterOption = {
  id: string;
  label: string;
  academicYear?: string;
};

export type DeanSummaryMetrics = {
  totalFaculty: number;
  totalSubmissions: number;
  totalAnalyzed: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
};

export type DeanOverallSentimentDatum = {
  label: string;
  value: number;
  color: string;
};

export type DeanDashboardViewModel = {
  semesters: DeanSemesterOption[];
  selectedSemesterId: string | null;
  selectedSemesterLabel: string;
  lastUpdatedLabel: string;
  summary: DeanSummaryMetrics;
  overallSentiment: DeanOverallSentimentDatum[];
};

export type DeanFacultyAnalysisDetailViewModel = {
  faculty: (typeof deanAnalyticsSampleData.facultyAnalysis)[number];
};

export function mapSemesterOptionsToViewModel(
  semesters: SemesterOptionDto[]
): DeanSemesterOption[] {
  return semesters.map((semester) => ({
    id: semester.id,
    label: semester.label ?? [semester.code, semester.academicYear].filter(Boolean).join(" • "),
    academicYear: semester.academicYear,
  }));
}

export function mapDepartmentOverviewToDashboardViewModel({
  overview,
  semesters,
  selectedSemesterId,
  lastUpdatedLabel,
}: {
  overview: DepartmentOverviewResponseDto;
  semesters: DeanSemesterOption[];
  selectedSemesterId: string | null;
  lastUpdatedLabel: string;
}): DeanDashboardViewModel {
  const totalSentiment =
    overview.summary.positiveCount + overview.summary.negativeCount + overview.summary.neutralCount;
  const selectedSemester =
    semesters.find((semester) => semester.id === selectedSemesterId) ?? semesters[0];

  return {
    semesters,
    selectedSemesterId,
    selectedSemesterLabel: selectedSemester?.label ?? "Select semester",
    lastUpdatedLabel,
    summary: {
      totalFaculty: overview.summary.totalFaculty,
      totalSubmissions: overview.summary.totalSubmissions,
      totalAnalyzed: overview.summary.totalAnalyzed,
      positiveCount: overview.summary.positiveCount,
      negativeCount: overview.summary.negativeCount,
      neutralCount: overview.summary.neutralCount,
    },
    overallSentiment: [
      {
        label: "Positive",
        value:
          totalSentiment > 0
            ? Number(((overview.summary.positiveCount / totalSentiment) * 100).toFixed(1))
            : 0,
        color: "#5b8cff",
      },
      {
        label: "Neutral",
        value:
          totalSentiment > 0
            ? Number(((overview.summary.neutralCount / totalSentiment) * 100).toFixed(1))
            : 0,
        color: "#d1d5db",
      },
      {
        label: "Negative",
        value:
          totalSentiment > 0
            ? Number(((overview.summary.negativeCount / totalSentiment) * 100).toFixed(1))
            : 0,
        color: "#facc15",
      },
    ],
  };
}

export function getDeanFacultyAnalysisDetailViewModel(
  facultySlug: string
): DeanFacultyAnalysisDetailViewModel | null {
  const faculty = getDeanFacultyAnalysisBySlug(facultySlug);

  if (!faculty) {
    return null;
  }

  return { faculty };
}
