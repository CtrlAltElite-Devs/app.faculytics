import {
  deanAnalyticsSampleData,
  getDeanFacultyAnalysisBySlug,
  type DeanFacultyAnalysisRecord,
} from "@/features/faculty-analytics/lib/analytics-sample-data";

export type DeanAcademicYear = (typeof deanAnalyticsSampleData.academicYears)[number];

export type DeanSummaryMetrics = {
  faculties: number;
  studentResponses: number;
  positiveSentimentRate: number;
  courses: number;
};

export type DeanOverallSentimentDatum = {
  label: string;
  value: number;
  color: string;
};

export type DeanSemesterSentimentDatum = {
  sentiment: string;
  firstSemester: number;
  secondSemester: number;
  summerSemester: number;
};

export type DeanDashboardViewModel = {
  academicYears: readonly DeanAcademicYear[];
  defaultAcademicYear: DeanAcademicYear;
  lastUpdated: string;
  summary: DeanSummaryMetrics;
  overallSentiment: DeanOverallSentimentDatum[];
  semesterSentiment: DeanSemesterSentimentDatum[];
};

export type DeanFacultyAnalyticsListViewModel = {
  facultyAnalysis: DeanFacultyAnalysisRecord[];
};

export type DeanFacultyAnalysisDetailViewModel = {
  faculty: DeanFacultyAnalysisRecord;
};

export function getDeanDashboardViewModel(): DeanDashboardViewModel {
  return {
    academicYears: [...deanAnalyticsSampleData.academicYears],
    defaultAcademicYear: deanAnalyticsSampleData.selectedAcademicYear,
    lastUpdated: deanAnalyticsSampleData.lastUpdated,
    summary: {
      faculties: deanAnalyticsSampleData.summary.faculties,
      studentResponses: deanAnalyticsSampleData.summary.studentResponses,
      positiveSentimentRate: deanAnalyticsSampleData.summary.positiveSentimentRate,
      courses: deanAnalyticsSampleData.summary.courses,
    },
    overallSentiment: deanAnalyticsSampleData.overallSentiment.map((item) => ({
      label: item.label,
      value: item.value,
      color: item.color,
    })),
    semesterSentiment: deanAnalyticsSampleData.semesterSentiment.map((item) => ({
      sentiment: item.sentiment,
      firstSemester: item.firstSemester,
      secondSemester: item.secondSemester,
      summerSemester: item.summerSemester,
    })),
  };
}

export function getDeanFacultyAnalyticsListViewModel(): DeanFacultyAnalyticsListViewModel {
  return {
    facultyAnalysis: [...deanAnalyticsSampleData.facultyAnalysis],
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
