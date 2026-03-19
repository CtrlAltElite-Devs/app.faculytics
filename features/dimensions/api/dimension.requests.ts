import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  CreateDimensionRequest,
  Dimension,
  DimensionsListResponse,
  ListDimensionsRequest,
} from "@/features/dimensions/types";

export async function fetchDimensions({
  questionnaireType,
  active = true,
  page = 1,
  limit = 100,
}: ListDimensionsRequest) {
  const response = await apiClient.get<DimensionsListResponse>(Endpoints.dimensions, {
    params: {
      questionnaireType,
      active,
      page,
      limit,
    },
  });

  return response.data;
}

export async function createDimension(payload: CreateDimensionRequest) {
  const response = await apiClient.post<Dimension>(Endpoints.dimensions, payload);
  return response.data;
}
