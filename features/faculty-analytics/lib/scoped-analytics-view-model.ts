import { ALL_PROGRAMS_LABEL } from "@/features/faculty-analytics/constants/filters";
import type {
  DepartmentOptionDto,
  DepartmentOverviewResponseDto,
  ProgramOptionDto,
  SemesterOptionDto,
} from "@/features/faculty-analytics/types";

export type ScopedSemesterOption = {
  id: string;
  label: string;
  academicYear?: string;
};

export type ScopedDepartmentOption = {
  id: string;
  code: string;
  label: string;
};

export type ScopedSummaryMetrics = {
  totalFaculty: number;
  totalSubmissions: number;
  totalAnalyzed: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  positiveSentimentRate: number;
};

export type ScopedProgramOption = {
  id: string | null;
  code: string | null;
  label: string;
};

export type ScopedOverallSentimentDatum = {
  label: string;
  value: number;
  color: string;
};

export type ScopedDashboardViewModel = {
  semesters: ScopedSemesterOption[];
  selectedSemesterId: string | null;
  selectedSemesterLabel: string;
  lastUpdatedLabel: string;
  summary: ScopedSummaryMetrics;
  overallSentiment: ScopedOverallSentimentDatum[];
};

function toSentimentRate(count: number, total: number) {
  return total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0;
}

export function mapSemesterOptionsToViewModel(
  semesters: SemesterOptionDto[]
): ScopedSemesterOption[] {
  return semesters.map((semester) => ({
    id: semester.id,
    label: semester.label ?? [semester.code, semester.academicYear].filter(Boolean).join(" • "),
    academicYear: semester.academicYear,
  }));
}

export function mapDepartmentOptionsToViewModel(
  departments: DepartmentOptionDto[],
  allowAllDepartments = true
): ScopedDepartmentOption[] {
  const mappedDepartments = departments.map((department) => ({
    id: department.id,
    code: department.code,
    label: department.name?.trim() ? `${department.code} • ${department.name}` : department.code,
  }));

  if (!allowAllDepartments) {
    return mappedDepartments;
  }

  return [{ id: "", code: "", label: "All Departments" }, ...mappedDepartments];
}

export function mapProgramOptionsToViewModel(
  programs: ProgramOptionDto[],
  allowAllPrograms = true
): ScopedProgramOption[] {
  const mappedPrograms = programs.map((program) => ({
    id: program.id,
    code: program.code,
    label: program.name?.trim() ? `${program.code} • ${program.name}` : program.code,
  }));

  if (!allowAllPrograms) {
    return mappedPrograms;
  }

  return [{ id: null, code: null, label: ALL_PROGRAMS_LABEL }, ...mappedPrograms];
}

export function mapDepartmentOverviewToDashboardViewModel({
  overview,
  semesters,
  selectedSemesterId,
  lastUpdatedLabel,
}: {
  overview: DepartmentOverviewResponseDto;
  semesters: ScopedSemesterOption[];
  selectedSemesterId: string | null;
  lastUpdatedLabel: string;
}): ScopedDashboardViewModel {
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
