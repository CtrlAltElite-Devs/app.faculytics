import { ALL_PROGRAMS_LABEL } from "@/features/faculty-analytics/constants/filters";
import { isHiddenFaculty } from "@/features/faculty-analytics/lib/hidden-faculty";
import { SENTIMENT_HEX } from "@/features/faculty-analytics/lib/sentiment-colors";
import type {
  DepartmentOptionDto,
  DepartmentOverviewFacultyDto,
  DepartmentOverviewResponseDto,
  ProgramOptionDto,
  SemesterOptionDto,
} from "@/features/faculty-analytics/types";
import { formatSemesterDisplay } from "@/lib/format-semester";

export type ScopedSemesterOption = {
  id: string;
  label: string;
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

export type ScopedFacultyRankingRow = {
  displayRank: number;
  facultyId: string;
  facultyName: string;
  departmentCode: string;
  avgNormalizedScore: number;
  percentileRank: number;
  submissionCount: number;
  commentCount: number;
  analyzedCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positiveSentimentRate: number;
  topicCount: number;
  scoreDelta: number | null;
  sentimentDelta: number | null;
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
    label: formatSemesterDisplay(semester),
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

export function mapDepartmentOverviewFacultyToRankingRows(
  faculty: readonly DepartmentOverviewFacultyDto[]
): ScopedFacultyRankingRow[] {
  return faculty
    .filter((item) => !isHiddenFaculty(item.facultyId))
    .sort((a, b) => {
      const percentileComparison = b.percentileRank - a.percentileRank;

      if (percentileComparison !== 0) {
        return percentileComparison;
      }

      const scoreComparison = b.avgNormalizedScore - a.avgNormalizedScore;

      if (scoreComparison !== 0) {
        return scoreComparison;
      }

      return a.facultyName.localeCompare(b.facultyName);
    })
    .map((item, index) => {
      const sentimentTotal = item.positiveCount + item.neutralCount + item.negativeCount;

      return {
        displayRank: index + 1,
        facultyId: item.facultyId,
        facultyName: item.facultyName,
        departmentCode: item.departmentCode,
        avgNormalizedScore: item.avgNormalizedScore,
        percentileRank: item.percentileRank,
        submissionCount: item.submissionCount,
        commentCount: item.commentCount,
        analyzedCount: item.analyzedCount,
        positiveCount: item.positiveCount,
        neutralCount: item.neutralCount,
        negativeCount: item.negativeCount,
        positiveSentimentRate: toSentimentRate(item.positiveCount, sentimentTotal),
        topicCount: item.topicCount,
        scoreDelta: item.scoreDelta,
        sentimentDelta: item.sentimentDelta,
      };
    });
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
        color: SENTIMENT_HEX.positive,
      },
      {
        label: "Neutral",
        value: toSentimentRate(overview.summary.neutralCount, totalSentiment),
        color: SENTIMENT_HEX.neutral,
      },
      {
        label: "Negative",
        value: toSentimentRate(overview.summary.negativeCount, totalSentiment),
        color: SENTIMENT_HEX.negative,
      },
    ],
  };
}
