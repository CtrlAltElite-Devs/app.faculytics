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
  startDate: string;
  endDate?: string;
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

export type DepartmentOptionDto = {
  id: string;
  code: string;
  name: string | null;
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

export type DepartmentListResponseDto = {
  data: DepartmentOptionDto[];
  meta: PaginationMetaDto;
};

export type ListDepartmentsQuery = {
  semesterId: string;
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
  departmentId?: string;
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

export type SentimentLabel = "positive" | "neutral" | "negative";

export type FacultyReportCommentsQuery = FacultyReportQuery & {
  page?: number;
  limit?: number;
  sentiment?: SentimentLabel;
  themeId?: string;
};

export type FacultyReportFacultyDto = {
  id: string;
  name: string;
  profilePicture?: string | null;
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
  // Counts keyed by the stringified numericValue ("1".."5" for Likert-5,
  // "0"/"1" for YES_NO). Empty object when no responses were recorded.
  ratingCounts: Record<string, number>;
};

export type FacultyReportSectionDto = {
  sectionId: string;
  title: string;
  order: number;
  weight: number;
  questions: FacultyReportQuestionDto[];
  sectionAverage: number;
  sectionInterpretation: string;
  responseCount: number;
};

export type FacultyReportDimensionDto = {
  code: string;
  displayName: string;
  average: number;
  responseCount: number;
  interpretation: string;
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
  dimensions: FacultyReportDimensionDto[];
};

export type FacultyReportCommentDto = {
  text: string;
  submittedAt: string;
  sentiment?: SentimentLabel;
  themeIds?: string[];
};

export type FacultyReportCommentsResponseDto = {
  items: FacultyReportCommentDto[];
  meta: PaginationMetaDto;
};

// ─────────────────────────────────────────────────────────────────────────────
// Faculty Composite Overall Rating (50/25/25)
//
// Mirrors backend:
//   api.faculytics/src/modules/analytics/lib/composite-rating.constants.ts
//   api.faculytics/src/modules/analytics/dto/responses/faculty-overview.response.dto.ts
// Keep CompositeCoverageStatus in sync if the backend enum changes.
// ─────────────────────────────────────────────────────────────────────────────

export type FacultyOverviewQuery = {
  facultyId: string;
  semesterId: string;
  courseId?: string;
};

export type CompositeCoverageStatus =
  | "FULL"
  | "PARTIAL"
  | "PARTIAL_NO_FEEDBACK"
  | "FEEDBACK_ONLY"
  | "INSUFFICIENT"
  | "NO_DATA";

export type CompositeQuestionnaireTypeCode =
  | "FACULTY_FEEDBACK"
  | "FACULTY_OUT_OF_CLASSROOM"
  | "FACULTY_IN_CLASSROOM";

export type FacultyOverviewCompositeDto = {
  rating: number | null;
  interpretation: string | null;
  coverageStatus: CompositeCoverageStatus;
  coverageWeight: number;
};

export type FacultyOverviewContributionDto = {
  questionnaireTypeCode: string;
  questionnaireTypeName: string;
  rating: number | null;
  weight: number;
  effectiveWeight: number;
  contribution: number | null;
  submissionCount: number;
};

export type FacultyOverviewResponseDto = {
  faculty: FacultyReportFacultyDto;
  semester: FacultyReportSemesterDto;
  composite: FacultyOverviewCompositeDto;
  contributions: FacultyOverviewContributionDto[];
};

// Canonical display order of composite tracks — defensive client sort.
export const COMPOSITE_TYPE_ORDER: readonly CompositeQuestionnaireTypeCode[] = [
  "FACULTY_FEEDBACK",
  "FACULTY_OUT_OF_CLASSROOM",
  "FACULTY_IN_CLASSROOM",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Qualitative Summary (FAC-134)
// ─────────────────────────────────────────────────────────────────────────────

export type SentimentDistributionDto = {
  positive: number;
  neutral: number;
  negative: number;
};

export type QualitativeThemeDto = {
  themeId: string;
  label: string;
  count: number;
  sentimentSplit: SentimentDistributionDto;
  sampleQuotes?: string[];
};

export type QualitativeSummaryResponseDto = {
  sentimentDistribution: SentimentDistributionDto;
  themes: QualitativeThemeDto[];
};

export type QualitativeSummaryQuery = {
  facultyId: string;
  semesterId: string;
  questionnaireTypeCode: string;
  courseId?: string;
};

export type FacultyReportCourseOption = {
  id: string;
  label: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Tri-view split (FAC-135) — view tabs and per-faculty questionnaire types
// ─────────────────────────────────────────────────────────────────────────────

export type ReportView = "insights" | "scores" | "feedback";

export const REPORT_VIEW_ORDER: readonly ReportView[] = ["insights", "scores", "feedback"];

export const DEFAULT_REPORT_VIEW: ReportView = "insights";

export const REPORT_VIEW_LABELS: Record<ReportView, string> = {
  insights: "Insights",
  scores: "Scores",
  feedback: "Feedback",
};

export type FacultyQuestionnaireTypeOptionDto = {
  code: string;
  name: string;
  submissionCount: number;
};

export type FacultyQuestionnaireTypesResponseDto = {
  items: FacultyQuestionnaireTypeOptionDto[];
};

export type FacultyQuestionnaireTypesQuery = {
  facultyId: string;
  semesterId: string;
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

// Canonical explicit scope is `{ scopeType, scopeId }` plus `semesterId`,
// but scoped dashboards still rely on backend role inference and may send
// only `semesterId` for create/list flows.
export type ScopeType = "FACULTY" | "DEPARTMENT" | "CAMPUS";

// For scoped dashboards, `scopeType`/`scopeId` may be omitted and inferred
// by the backend from the caller role. Faculty self-view still passes them
// explicitly.
export type PipelineScopeIds = {
  semesterId: string;
  scopeType?: ScopeType;
  scopeId?: string;
  questionnaireVersionId?: string;
};

// GET /analysis/pipelines query: scopeType + scopeId are OPTIONAL — the
// backend resolves the caller's scope (Dean's department, Campus Head's
// campus) when omitted. Faculty self-view still passes them explicitly.
export type ListPipelinesQueryShape = {
  semesterId: string;
  scopeType?: ScopeType;
  scopeId?: string;
  questionnaireVersionId?: string;
};

// FAC-135 Phase C: the four recommendation facets. Backend enums are
// camelCase for facet values (see recommendations.dto.ts) — match verbatim.
export type Facet = "overall" | "facultyFeedback" | "inClassroom" | "outOfClassroom";

export type CoverageSlice = {
  submissionCount: number;
  commentCount: number;
};

export type VoiceBreakdown = {
  facultyFeedback: CoverageSlice;
  inClassroom: CoverageSlice;
  outOfClassroom: CoverageSlice;
  other: CoverageSlice;
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
  // FAC-135 Phase A: per-questionnaire-type coverage slices. Optional for
  // back-compat with pipelines cached before this field existed.
  voiceBreakdown?: VoiceBreakdown | null;
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
  // FAC-135 Phase A: non-optional human-readable scope label
  // (e.g. "Faculty: Jane Cruz", "Department: CS", "Legacy scope").
  scopeLabel: string;
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
  // FAC-135 Phase B: ISO timestamp of the next scheduled refresh from the
  // tiered scheduler. Optional / nullable so the frontend falls back to
  // generic copy if the registry lookup fails (R3 mitigation — AC38).
  nextScheduledRunAt?: string | null;
};

export type PipelineSummary = {
  id: string;
  status: PipelineStatus;
  // FAC-135 Phase A: non-optional human-readable scope label.
  scopeLabel: string;
  scope: PipelineScopeDisplay;
  coverage: PipelineCoverage;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type CreatePipelineRequest = PipelineScopeIds;
export type ListPipelinesQuery = ListPipelinesQueryShape;

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
  // Internal metadata only — no UI consumer post Step D. See tech-spec-insights-facet-removal-and-theme-action-relink.
  facet: Facet;
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
