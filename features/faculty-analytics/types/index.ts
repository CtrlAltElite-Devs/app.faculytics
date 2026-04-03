// Temporary types derived from mock data.
// Replace with backend DTOs when wiring to the real API.
// See features/faculty-analytics/MIGRATION.md for the target response shapes.

export type QuantitativeMetricScore = {
  metric: string;
  score: number;
};

export type SemesterKey = "firstSemester" | "secondSemester" | "summerSemester";

export type FacultyAnalysisSemesterKey = SemesterKey;

export type QualitativeTheme = {
  label: string;
  mentions: number;
};

export type QualitativeActionPlan = {
  title: string;
  items: string[];
};

export type QualitativeInsight = {
  title: string;
  description: string;
};

export type FacultyFeedbackRecord = {
  date: string;
  feedback: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  type: "In Classroom" | "Out of Classroom" | "Student Evaluation";
};

export type SemesterOptionDto = {
  id: string;
  code: string;
  label?: string;
  academicYear?: string;
  campus: {
    id: string;
    name: string;
    code: string;
  };
};

export type SemesterListResponseDto = {
  data: SemesterOptionDto[];
};

export type ListSemestersQuery = {
  campusId?: string;
};

export type DepartmentOverviewQuery = {
  semesterId: string;
  programCode?: string;
};

export type DepartmentOverviewFacultyDto = {
  facultyId: string;
  facultyName: string;
  departmentCode: string;
  submissionCount: number;
  commentCount: number;
  avgNormalizedScore: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  analyzedCount: number;
  topicCount: number;
  percentileRank: number;
  scoreDelta: number | null;
  sentimentDelta: number | null;
};

export type DepartmentOverviewSummaryDto = {
  totalFaculty: number;
  totalSubmissions: number;
  totalAnalyzed: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
};

export type DepartmentOverviewResponseDto = {
  summary: DepartmentOverviewSummaryDto;
  faculty: DepartmentOverviewFacultyDto[];
  lastRefreshedAt: string | null;
};
