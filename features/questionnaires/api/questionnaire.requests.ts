import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  CheckSubmissionParams,
  CheckSubmissionResponse,
  CreateQuestionnaireRequest,
  CreateQuestionnaireVersionRequest,
  DraftResponse,
  FetchDraftParams,
  Questionnaire,
  QuestionnaireVersionDetail,
  QuestionnaireType,
  QuestionnaireTypeSummary,
  QuestionnaireVersion,
  QuestionnaireVersionsResponse,
  SaveDraftPayload,
  SubmitEvaluationPayload,
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
 * Fetch questionnaire versions for a specific questionnaire type.
 */
export async function fetchQuestionnaireVersionsByType(type: QuestionnaireType) {
  const response = await apiClient.get<QuestionnaireVersionsResponse>(
    Endpoints.questionnaireTypeVersions.replace(":type", type)
  );
  return response.data;
}

/**
 * Fetch the latest active version for a questionnaire (no role restriction).
 * Returns the full version entity with schemaSnapshot, or null if none active.
 */
export async function fetchLatestActiveVersion(questionnaireId: string) {
  const response = await apiClient.get<QuestionnaireVersionDetail | null>(
    Endpoints.questionnaireLatestActiveVersion.replace(":id", questionnaireId),
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
  const response = await apiClient.post<QuestionnaireVersion>(
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
    { params },
  );
  return response.data;
}

// --- Drafts ---

/**
 * Save or update a draft (upsert).
 */
export async function saveDraft(payload: SaveDraftPayload) {
  const response = await apiClient.post<DraftResponse>(
    Endpoints.questionnaireDrafts,
    payload,
  );
  return response.data;
}

/**
 * Fetch an existing draft by version + faculty + semester.
 * Returns null if no draft exists.
 */
export async function fetchDraft(params: FetchDraftParams) {
  const response = await apiClient.get<DraftResponse | null>(
    Endpoints.questionnaireDrafts,
    { params },
  );
  return response.data;
}

/**
 * Delete a draft by ID.
 */
export async function deleteDraft(draftId: string) {
  const response = await apiClient.delete(`${Endpoints.questionnaireDrafts}/${draftId}`);
  return response.data;
}
