import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  CreateDimensionRequest,
  Dimension,
  DimensionsListResponse,
  ListDimensionsRequest,
  UpdateDimensionRequest,
} from "@/features/dimensions/types";

export async function fetchDimensions(params: ListDimensionsRequest) {
  const response = await apiClient.get<DimensionsListResponse>(Endpoints.dimensions, {
    params,
  });

  return response.data;
}

export async function createDimension(payload: CreateDimensionRequest) {
  const response = await apiClient.post<Dimension>(Endpoints.dimensions, payload);
  return response.data;
}

export async function updateDimension(id: string, payload: UpdateDimensionRequest) {
  const response = await apiClient.patch<Dimension>(
    Endpoints.dimensionById.replace(":id", id),
    payload
  );
  return response.data;
}

export async function activateDimension(id: string) {
  const response = await apiClient.patch<Dimension>(Endpoints.dimensionActivate.replace(":id", id));
  return response.data;
}

export async function deactivateDimension(id: string) {
  const response = await apiClient.patch<Dimension>(
    Endpoints.dimensionDeactivate.replace(":id", id)
  );
  return response.data;
}
