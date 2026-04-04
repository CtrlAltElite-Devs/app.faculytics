import {
  deanAnalyticsSampleData,
  getDeanFacultyAnalysisBySlug,
} from "@/features/faculty-analytics/lib/analytics-sample-data";
import { ALL_PROGRAMS_LABEL } from "@/features/faculty-analytics/constants/filters";
import type {
  DepartmentOverviewResponseDto,
  ProgramOptionDto,
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
  positiveSentimentRate: number;
};

export type DeanProgramOption = {
  id: string | null;
  code: string | null;
  label: string;
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

function toSentimentRate(count: number, total: number) {
  return total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0;
}

export function mapSemesterOptionsToViewModel(
  semesters: SemesterOptionDto[]
): DeanSemesterOption[] {
  return semesters.map((semester) => ({
    id: semester.id,
    label: semester.label ?? [semester.code, semester.academicYear].filter(Boolean).join(" • "),
    academicYear: semester.academicYear,
  }));
}

export function mapProgramOptionsToViewModel(programs: ProgramOptionDto[]): DeanProgramOption[] {
  return [
    { id: null, code: null, label: ALL_PROGRAMS_LABEL },
    ...programs.map((program) => ({
      id: program.id,
      code: program.code,
      label: program.name?.trim() ? `${program.code} • ${program.name}` : program.code,
    })),
  ];
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
      positiveSentimentRate: toSentimentRate(overview.summary.positiveCount, totalSentiment),
    },
    overallSentiment: [
      {
        label: "Positive",
        value: toSentimentRate(overview.summary.positiveCount, totalSentiment),
        color: "#5b8cff",
      },
      {
        label: "Neutral",
        value: toSentimentRate(overview.summary.neutralCount, totalSentiment),
        color: "#d1d5db",
      },
      {
        label: "Negative",
        value: toSentimentRate(overview.summary.negativeCount, totalSentiment),
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
