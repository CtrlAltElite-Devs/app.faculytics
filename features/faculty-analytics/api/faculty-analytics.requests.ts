import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  AttentionListQuery,
  AttentionListResponseDto,
  DepartmentOverviewQuery,
  DepartmentOverviewResponseDto,
  ListSemestersQuery,
  SemesterListResponseDto,
} from "@/features/faculty-analytics/types";

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

export async function fetchSemesters(params?: ListSemestersQuery) {
  const response = await apiClient.get<SemesterListResponseDto>(Endpoints.semesters, {
    params,
  });
  return response.data;
}
