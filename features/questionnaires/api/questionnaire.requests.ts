import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  CreateQuestionnaireRequest,
  CreateQuestionnaireVersionRequest,
  Questionnaire,
  QuestionnaireVersionDetail,
  QuestionnaireType,
  QuestionnaireTypeSummary,
  QuestionnaireVersion,
  QuestionnaireVersionsResponse,
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
 * Fetch a questionnaire version by ID.
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
