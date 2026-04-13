import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  FacultyEvaluationListQuery,
  FacultyEvaluationListResponse,
} from "@/features/faculty-evaluation/types";

export async function fetchScopedFacultyList(params: FacultyEvaluationListQuery) {
  const response = await apiClient.get<FacultyEvaluationListResponse>(Endpoints.faculty, {
    params,
  });
  return response.data;
}
