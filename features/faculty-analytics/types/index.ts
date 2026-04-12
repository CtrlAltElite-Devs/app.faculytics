// Mixed DTOs for the current backend-integrated dean analytics screens and the
// remaining mock-backed faculty detail view pending migration.

export type QuantitativeMetricScore = {
  metric: string;
  score: number;
};

export type SemesterKey = "firstSemester" | "secondSemester" | "summerSemester";

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

export type ProgramOptionDto = {
  id: string;
  code: string;
  name: string | null;
  departmentId: string;
};

export type PaginationMetaDto = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type ProgramListResponseDto = {
  data: ProgramOptionDto[];
  meta: PaginationMetaDto;
};

export type ListProgramsQuery = {
  semesterId: string;
  departmentId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type DepartmentOverviewQuery = {
  semesterId: string;
  programCode?: string;
};

export type AttentionListQuery = {
  semesterId: string;
  programCode?: string;
};

export type FacultyListQuery = {
  semesterId: string;
  programId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type FacultyListItemDto = {
  id: string;
  fullName: string;
  profilePicture: string | null;
  subjects: string[];
};

export type FacultyListResponseDto = {
  data: FacultyListItemDto[];
  meta: PaginationMetaDto;
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

export type AttentionFlagType = "declining_trend" | "quant_qual_gap" | "low_coverage";

export type AttentionFlagDto = {
  type: AttentionFlagType;
  description: string;
  metrics: Record<string, number>;
};

export type AttentionItemDto = {
  facultyId: string;
  facultyName: string;
  departmentCode: string;
  flags: AttentionFlagDto[];
};

export type AttentionListResponseDto = {
  items: AttentionItemDto[];
  lastRefreshedAt: string | null;
};
