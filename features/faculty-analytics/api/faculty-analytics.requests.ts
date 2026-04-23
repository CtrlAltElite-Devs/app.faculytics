import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  AttentionListQuery,
  AttentionListResponseDto,
  BatchReportStatusQuery,
  BatchStatusResponseDto,
  DepartmentOverviewQuery,
  DepartmentOverviewResponseDto,
  DepartmentListResponseDto,
  FacultyReportCommentsQuery,
  FacultyReportCommentsResponseDto,
  FacultyReportQuery,
  FacultyReportResponseDto,
  FacultyOverviewQuery,
  FacultyOverviewResponseDto,
  FacultyListQuery,
  FacultyListResponseDto,
  GenerateBatchReportRequest,
  GenerateBatchReportResponse,
  GenerateSingleReportRequest,
  GenerateSingleReportResponse,
  ListProgramsQuery,
  ListDepartmentsQuery,
  ListSemestersQuery,
  ProgramListResponseDto,
  QualitativeSummaryQuery,
  QualitativeSummaryResponseDto,
  ReportStatusResponseDto,
  SemesterListResponseDto,
  FacultyQuestionnaireTypesQuery,
  FacultyQuestionnaireTypesResponseDto,
} from "@/features/faculty-analytics/types";
import type { MyEnrollmentsResponseDto } from "@/features/enrollments/types";

export async function fetchDepartmentOverview(params: DepartmentOverviewQuery) {
  const response = await apiClient.get<DepartmentOverviewResponseDto>(Endpoints.analyticsOverview, {
    params,
  });

  return response.data;
}

export async function fetchAttentionList(params: AttentionListQuery) {
  const response = await apiClient.get<AttentionListResponseDto>(Endpoints.analyticsAttention, {
    params,
  });

  return response.data;
}

export async function generateSingleReport(payload: GenerateSingleReportRequest) {
  const response = await apiClient.post<GenerateSingleReportResponse>(
    Endpoints.reportsGenerate,
    payload
  );

  return response.data;
}

export async function fetchReportStatus(jobId: string) {
  const response = await apiClient.get<ReportStatusResponseDto>(
    Endpoints.reportsStatus.replace(":jobId", jobId)
  );

  return response.data;
}

export async function generateBatchReport(payload: GenerateBatchReportRequest) {
  const response = await apiClient.post<GenerateBatchReportResponse>(
    Endpoints.reportsGenerateBatch,
    payload
  );

  return response.data;
}

export async function fetchBatchReportStatus({ batchId, ...params }: BatchReportStatusQuery) {
  const response = await apiClient.get<BatchStatusResponseDto>(
    Endpoints.reportsBatchStatus.replace(":batchId", batchId),
    { params }
  );

  return response.data;
}

export async function fetchFacultyReport({ facultyId, ...params }: FacultyReportQuery) {
  const response = await apiClient.get<FacultyReportResponseDto>(
    Endpoints.analyticsFacultyReport.replace(":facultyId", facultyId),
    { params }
  );

  return response.data;
}

export async function fetchFacultyReportComments({
  facultyId,
  ...params
}: FacultyReportCommentsQuery) {
  const response = await apiClient.get<FacultyReportCommentsResponseDto>(
    Endpoints.analyticsFacultyReportComments.replace(":facultyId", facultyId),
    { params }
  );

  return response.data;
}

export async function fetchFacultyOverview({
  facultyId,
  semesterId,
  courseId,
}: FacultyOverviewQuery) {
  const response = await apiClient.get<FacultyOverviewResponseDto>(
    Endpoints.analyticsFacultyOverview.replace(":facultyId", facultyId),
    { params: courseId ? { semesterId, courseId } : { semesterId } }
  );

  return response.data;
}

export async function fetchQualitativeSummary({ facultyId, ...params }: QualitativeSummaryQuery) {
  const response = await apiClient.get<QualitativeSummaryResponseDto>(
    Endpoints.analyticsFacultyQualitativeSummary.replace(":facultyId", facultyId),
    { params }
  );

  return response.data;
}

export async function getFacultyQuestionnaireTypes({
  facultyId,
  ...params
}: FacultyQuestionnaireTypesQuery) {
  const response = await apiClient.get<FacultyQuestionnaireTypesResponseDto>(
    Endpoints.analyticsFacultyQuestionnaireTypes.replace(":facultyId", facultyId),
    { params }
  );

  return response.data;
}

export async function fetchFacultyList(params: FacultyListQuery) {
  const response = await apiClient.get<FacultyListResponseDto>(Endpoints.faculty, {
    params,
  });

  return response.data;
}

type FetchFacultyEnrollmentsParams = {
  facultyId: string;
  semesterId: string;
  page?: number;
  limit?: number;
};

export async function fetchFacultyEnrollments({
  facultyId,
  ...params
}: FetchFacultyEnrollmentsParams) {
  const response = await apiClient.get<MyEnrollmentsResponseDto>(
    Endpoints.facultyEnrollments.replace(":facultyId", facultyId),
    { params }
  );

  return response.data;
}

export async function fetchProgramOptions(params: ListProgramsQuery) {
  const response = await apiClient.get<ProgramListResponseDto>(Endpoints.curriculumPrograms, {
    params,
  });

  return response.data;
}

export async function fetchDepartmentOptions(params: ListDepartmentsQuery) {
  const response = await apiClient.get<DepartmentListResponseDto>(Endpoints.curriculumDepartments, {
    params,
  });

  return response.data;
}

export async function fetchSemesters(params?: ListSemestersQuery) {
  const response = await apiClient.get<SemesterListResponseDto>(Endpoints.semesters, {
    params,
  });
  return response.data;
}
