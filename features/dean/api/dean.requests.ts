import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type { FacultyListQuery, FacultyListResponseDto } from "@/features/dean/types";

export async function fetchFacultyList(params: FacultyListQuery) {
  const response = await apiClient.get<FacultyListResponseDto>(Endpoints.faculty, {
    params,
  });
  return response.data;
}
