import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  CreateQuestionnaireRequest,
  CreateQuestionnaireVersionRequest,
  Questionnaire,
  QuestionnaireType,
  QuestionnaireTypeSummary,
  QuestionnaireVersion,
  QuestionnaireVersionsResponse,
} from "@/types/questionnaires";

export async function fetchQuestionnaireTypes() {
  const response = await apiClient.get<QuestionnaireTypeSummary[]>(Endpoints.questionnaireTypes);
  return response.data;
}

export async function fetchQuestionnaireVersionsByType(type: QuestionnaireType) {
  const response = await apiClient.get<QuestionnaireVersionsResponse>(
    Endpoints.questionnaireTypeVersions.replace(":type", type)
  );
  return response.data;
}

export async function createQuestionnaire(payload: CreateQuestionnaireRequest) {
  const response = await apiClient.post<Questionnaire>(Endpoints.questionnaires, payload);
  return response.data;
}

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
