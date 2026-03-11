import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  QuestionnaireType,
  QuestionnaireTypeSummary,
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
