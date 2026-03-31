// Temporary types derived from mock data.
// Replace with backend DTOs when wiring to the real API.
// See features/dean/MIGRATION.md for the target response shapes.

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
};

export type FacultyListQuery = {
  semesterId: string;
  departmentId?: string;
  programId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type FacultyListItem = {
  id: string;
  fullName: string;
  profilePicture: string | null;
  subjects: string[];
};

export type FacultyListMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type FacultyListResponseDto = {
  data: FacultyListItem[];
  meta: FacultyListMeta;
};
