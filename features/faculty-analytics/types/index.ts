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

export type GenerateSingleReportRequest = {
  facultyId: string;
  semesterId: string;
  questionnaireTypeCode: string;
};

export type GenerateSingleReportResponse = {
  jobId: string;
};

export type ReportJobStatus = "waiting" | "active" | "completed" | "failed" | "skipped";

export type ReportStatusResponseDto = {
  jobId: string;
  status: ReportJobStatus;
  facultyName: string;
  downloadUrl?: string;
  expiresAt?: string;
  error?: string;
  message?: string;
  createdAt: string;
  completedAt?: string;
};

export type GenerateBatchReportRequest = {
  semesterId: string;
  questionnaireTypeCode: string;
  departmentId?: string;
  programId?: string;
};

export type GenerateBatchReportResponse = {
  batchId: string;
  jobCount: number;
  skippedCount: number;
};

export type BatchReportStatusQuery = {
  batchId: string;
  page?: number;
  limit?: number;
};

export type BatchStatusResponseDto = {
  batchId: string;
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  active: number;
  waiting: number;
  jobs: ReportStatusResponseDto[];
  meta: PaginationMetaDto;
};

export type FacultyReportQuery = {
  facultyId: string;
  semesterId: string;
  questionnaireTypeCode: string;
  courseId?: string;
};

export type FacultyReportCommentsQuery = FacultyReportQuery & {
  page?: number;
  limit?: number;
};

export type FacultyReportFacultyDto = {
  id: string;
  name: string;
};

export type FacultyReportSemesterDto = {
  id: string;
  code: string;
  label: string;
  academicYear: string;
};

export type FacultyReportQuestionnaireTypeDto = {
  code: string;
  name: string;
};

export type FacultyReportCourseFilterDto = {
  id: string;
  code: string;
  title: string;
};

export type FacultyReportQuestionDto = {
  questionId: string;
  order: number;
  text: string;
  average: number;
  responseCount: number;
  interpretation: string;
};

export type FacultyReportSectionDto = {
  sectionId: string;
  title: string;
  order: number;
  weight: number;
  questions: FacultyReportQuestionDto[];
  sectionAverage: number;
  sectionInterpretation: string;
};

export type FacultyReportResponseDto = {
  faculty: FacultyReportFacultyDto;
  semester: FacultyReportSemesterDto;
  questionnaireType: FacultyReportQuestionnaireTypeDto;
  courseFilter: FacultyReportCourseFilterDto | null;
  submissionCount: number;
  sections: FacultyReportSectionDto[];
  overallRating: number | null;
  overallInterpretation: string | null;
};

export type FacultyReportCommentDto = {
  text: string;
  submittedAt: string;
};

export type FacultyReportCommentsResponseDto = {
  items: FacultyReportCommentDto[];
  meta: PaginationMetaDto;
};

export type FacultyReportCourseOption = {
  id: string;
  label: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Analysis Pipeline (FAC-132)
//
// Mirrors backend shapes from api.faculytics:
//   - src/modules/analysis/enums/pipeline-status.enum.ts   (PipelineStatus)
//   - src/modules/analysis/enums/run-status.enum.ts        (RunStatus)
//   - src/modules/analysis/dto/pipeline-status.dto.ts      (PipelineStatusResponse)
//   - src/modules/analysis/dto/responses/pipeline-summary.response.dto.ts
//   - src/modules/analysis/dto/responses/recommendations.response.dto.ts
//   - src/modules/analysis/dto/recommendations.dto.ts      (SupportingEvidence)
// Enum string values are UPPERCASE, matching the backend verbatim.
// ─────────────────────────────────────────────────────────────────────────────

export type PipelineStatus =
  | "AWAITING_CONFIRMATION"
  | "EMBEDDING_CHECK"
  | "SENTIMENT_ANALYSIS"
  | "SENTIMENT_GATE"
  | "TOPIC_MODELING"
  | "GENERATING_RECOMMENDATIONS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type RunStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

// IDs only — used for CreatePipelineRequest and ListPipelinesQuery inputs.
// Every scope field is optional at the type level; the BACKEND enforces (per
// TD-2) that non-SUPER_ADMIN callers supply at least one scope filter beyond
// `semesterId`, else 400 Bad Request. Type-level branching by role is
// deliberately avoided here — a clear comment + runtime contract is simpler.
export type PipelineScopeIds = {
  semesterId: string;
  facultyId?: string;
  departmentId?: string;
  programId?: string;
  campusId?: string;
  courseId?: string;
  questionnaireVersionId?: string;
};

// IDs + display values paired — shape of pipeline.status response's `scope`
// (TD-9). IDs are used by the frontend for cache keys and lookups; display
// values for UI rendering.
export type PipelineScopeDisplay = {
  semesterId: string;
  semesterCode: string;
  departmentId: string | null;
  departmentCode: string | null;
  facultyId: string | null;
  facultyName: string | null;
  programId: string | null;
  programCode: string | null;
  campusId: string | null;
  campusCode: string | null;
  courseId: string | null;
  courseShortname: string | null;
  questionnaireVersionId: string | null;
};

export type PipelineCoverage = {
  totalEnrolled: number;
  submissionCount: number;
  commentCount: number;
  responseRate: number;
  lastEnrollmentSyncAt: string | null;
};

export type PipelineStageStatus = {
  status: "pending" | "processing" | "completed" | "failed" | "skipped";
  progress: { current: number; total: number } | null;
  startedAt: string | null;
  completedAt: string | null;
};

export type PipelineSentimentGateStatus = PipelineStageStatus & {
  included: number | null;
  excluded: number | null;
};

export type PipelineStatusResponse = {
  id: string;
  status: PipelineStatus;
  scope: PipelineScopeDisplay;
  coverage: PipelineCoverage;
  stages: {
    embeddings: PipelineStageStatus;
    sentiment: PipelineStageStatus;
    sentimentGate: PipelineSentimentGateStatus;
    topicModeling: PipelineStageStatus;
    recommendations: PipelineStageStatus;
  };
  warnings: string[];
  errorMessage: string | null;
  retryable: boolean;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
};

export type PipelineSummary = {
  id: string;
  status: PipelineStatus;
  scope: PipelineScopeDisplay;
  coverage: PipelineCoverage;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type CreatePipelineRequest = PipelineScopeIds;
export type ListPipelinesQuery = PipelineScopeIds;

// ─── Recommendations ──────────────────────────────────────────────────────

export type TopicSource = {
  type: "topic";
  topicLabel: string;
  commentCount: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  // Backend caps at 3 items (recommendations.dto.ts:15: `.max(3)`). The
  // aggregateThemes helper must respect this ceiling when deduplicating.
  sampleQuotes: string[];
};

export type DimensionScoresSource = {
  type: "dimension";
  dimensionLabel: string;
  averageScore: number;
  responseCount: number;
};

export type SupportingEvidenceSource = TopicSource | DimensionScoresSource;

export type SupportingEvidence = {
  sources: SupportingEvidenceSource[];
  confidenceLevel: "HIGH" | "MEDIUM" | "LOW";
  basedOnSubmissions: number;
};

export type ActionCategory = "STRENGTH" | "IMPROVEMENT";
export type ActionPriority = "HIGH" | "MEDIUM" | "LOW";

export type RecommendedActionDto = {
  id: string;
  category: ActionCategory;
  headline: string;
  description: string;
  actionPlan: string;
  priority: ActionPriority;
  supportingEvidence: SupportingEvidence;
  createdAt: string;
};

export type RecommendationsResponse = {
  pipelineId: string;
  runId: string | null;
  // This is RunStatus, not PipelineStatus — the recommendations run
  // completes BEFORE the pipeline transitions to COMPLETED, so gates keying
  // off `pipeline.status === 'COMPLETED'` are the correct readiness signal.
  status: RunStatus;
  actions: RecommendedActionDto[];
  completedAt: string | null;
};
