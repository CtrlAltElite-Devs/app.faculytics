import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  CheckSubmissionParams,
  CheckSubmissionResponse,
  CreateQuestionnaireTypeManagementRequest,
  CreateQuestionnaireRequest,
  CreateQuestionnaireVersionRequest,
  DeleteQuestionnaireTypeManagementResponse,
  DraftResponse,
  FetchDraftParams,
  ListQuestionnaireTypeManagementRequest,
  Questionnaire,
  QuestionnaireTypeManagementEntity,
  QuestionnaireVersionDetail,
  QuestionnaireVersion,
  QuestionnaireTypeSummary,
  QuestionnaireVersionsResponse,
  SaveDraftPayload,
  SubmitEvaluationPayload,
  UpdateQuestionnaireTypeManagementRequest,
  UpdateQuestionnaireVersionRequest,
} from "@/features/questionnaires/types";

/**
 * Fetch available questionnaire type summaries.
 */
export async function fetchQuestionnaireTypes() {
  const response = await apiClient.get<QuestionnaireTypeSummary[]>(Endpoints.questionnaireTypes);
  return response.data;
}

/**
 * Fetch questionnaire type entities for the Super Admin management page.
 * This uses the admin CRUD endpoint, not the consumer-facing `/questionnaires/types` route.
 */
export async function fetchQuestionnaireTypeManagementList(
  params?: ListQuestionnaireTypeManagementRequest
) {
  const response = await apiClient.get<QuestionnaireTypeManagementEntity[]>(
    Endpoints.questionnaireTypeEntities,
    { params }
  );
  return response.data;
}

/**
 * Fetch a single questionnaire type entity from the admin CRUD endpoint.
 */
export async function fetchQuestionnaireTypeManagementDetail(id: string) {
  const response = await apiClient.get<QuestionnaireTypeManagementEntity>(
    Endpoints.questionnaireTypeEntityById.replace(":id", id)
  );
  return response.data;
}

/**
 * Create a custom questionnaire type through the admin CRUD endpoint.
 * The backend enforces SCREAMING_SNAKE_CASE for `code`.
 */
export async function createQuestionnaireTypeManagement(
  payload: CreateQuestionnaireTypeManagementRequest
) {
  const response = await apiClient.post<QuestionnaireTypeManagementEntity>(
    Endpoints.questionnaireTypeEntities,
    payload
  );
  return response.data;
}

/**
 * Update questionnaire type metadata. The backend only accepts `name` and `description`.
 */
export async function updateQuestionnaireTypeManagement({
  id,
  payload,
}: {
  id: string;
  payload: UpdateQuestionnaireTypeManagementRequest;
}) {
  const response = await apiClient.patch<QuestionnaireTypeManagementEntity>(
    Endpoints.questionnaireTypeEntityById.replace(":id", id),
    payload
  );
  return response.data;
}

/**
 * Soft-delete a questionnaire type through the admin CRUD endpoint.
 * The backend returns a success message instead of the deleted entity.
 */
export async function deleteQuestionnaireTypeManagement(id: string) {
  const response = await apiClient.delete<DeleteQuestionnaireTypeManagementResponse>(
    Endpoints.questionnaireTypeEntityById.replace(":id", id)
  );
  return response.data;
}

/**
 * Fetch questionnaire versions for a specific questionnaire type.
 * @param typeId - UUID of the questionnaire type entity
 */
export async function fetchQuestionnaireVersionsByType(typeId: string) {
  const response = await apiClient.get<QuestionnaireVersionsResponse>(
    Endpoints.questionnaireTypeVersions.replace(":type", typeId)
  );
  return response.data;
}

/**
 * Fetch the latest active version for a questionnaire (no role restriction).
 * Returns the full version entity with schemaSnapshot, or null if none active.
 */
export async function fetchLatestActiveVersion(questionnaireId: string) {
  const response = await apiClient.get<QuestionnaireVersionDetail | null>(
    Endpoints.questionnaireLatestActiveVersion.replace(":id", questionnaireId)
  );
  return response.data;
}

/**
 * Fetch a questionnaire version by ID (SUPER_ADMIN/ADMIN only).
 */
export async function fetchQuestionnaireVersionById(versionId: string) {
  const response = await apiClient.get<QuestionnaireVersionDetail>(
    Endpoints.questionnaireVersionById.replace(":versionId", versionId)
  );
  return response.data;
}

/**
 * Create a questionnaire root record for a questionnaire type.
 */
export async function createQuestionnaire(payload: CreateQuestionnaireRequest) {
  const response = await apiClient.post<Questionnaire>(Endpoints.questionnaires, payload);
  return response.data;
}

/**
 * Create a new version for an existing questionnaire.
 */
export async function createQuestionnaireVersion({
  questionnaireId,
  payload,
}: {
  questionnaireId: string;
  payload: CreateQuestionnaireVersionRequest;
}) {
  const response = await apiClient.post<QuestionnaireVersionDetail>(
    Endpoints.questionnaireVersions.replace(":id", questionnaireId),
    payload
  );
  return response.data;
}

/**
 * Update an existing draft questionnaire version.
 */
export async function updateQuestionnaireVersion({
  versionId,
  payload,
}: {
  versionId: string;
  payload: UpdateQuestionnaireVersionRequest;
}) {
  const response = await apiClient.patch<QuestionnaireVersionDetail>(
    Endpoints.questionnaireVersionById.replace(":versionId", versionId),
    payload
  );
  return response.data;
}

/**
 * Publish a draft questionnaire version.
 */
export async function publishQuestionnaireVersion(versionId: string) {
  const response = await apiClient.patch<QuestionnaireVersion>(
    Endpoints.questionnaireVersionPublish.replace(":versionId", versionId)
  );
  return response.data;
}

/**
 * Deprecate a questionnaire version.
 */
export async function deprecateQuestionnaireVersion(versionId: string) {
  const response = await apiClient.patch<QuestionnaireVersion>(
    Endpoints.questionnaireVersionDeprecate.replace(":versionId", versionId)
  );
  return response.data;
}

// --- Submissions ---

/**
 * Submit a faculty evaluation.
 */
export async function submitEvaluation(payload: SubmitEvaluationPayload) {
  const response = await apiClient.post(Endpoints.questionnaireSubmissions, payload);
  return response.data;
}

/**
 * Check if the current user already submitted for a given context.
 */
export async function checkSubmission(params: CheckSubmissionParams) {
  const response = await apiClient.get<CheckSubmissionResponse>(
    Endpoints.questionnaireSubmissionsCheck,
    { params }
  );
  return response.data;
}

// --- Drafts ---

/**
 * Save or update a draft (upsert).
 */
export async function saveDraft(payload: SaveDraftPayload) {
  const response = await apiClient.post<DraftResponse>(Endpoints.questionnaireDrafts, payload);
  return response.data;
}

/**
 * Fetch an existing draft by version + faculty + semester.
 * Returns null if no draft exists.
 */
export async function fetchDraft(params: FetchDraftParams) {
  const response = await apiClient.get<DraftResponse | null>(Endpoints.questionnaireDrafts, {
    params,
  });
  return response.data;
}

/**
 * Delete a draft by ID.
 */
export async function deleteDraft(draftId: string) {
  const response = await apiClient.delete(`${Endpoints.questionnaireDrafts}/${draftId}`);
  return response.data;
}
