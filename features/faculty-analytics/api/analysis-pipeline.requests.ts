import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type {
  CreatePipelineRequest,
  ListPipelinesQuery,
  PipelineStatusResponse,
  PipelineSummary,
  RecommendationsResponse,
} from "@/features/faculty-analytics/types";

export async function listPipelines(query: ListPipelinesQuery) {
  const response = await apiClient.get<PipelineSummary[]>(Endpoints.analysisPipelines, {
    params: query,
  });
  return response.data;
}

export async function createPipeline(body: CreatePipelineRequest) {
  const response = await apiClient.post<PipelineSummary>(Endpoints.analysisPipelines, body);
  return response.data;
}

export async function confirmPipeline(id: string) {
  const response = await apiClient.post<PipelineSummary>(
    Endpoints.analysisPipelinesConfirm.replace(":id", id)
  );
  return response.data;
}

export async function cancelPipeline(id: string) {
  const response = await apiClient.post<PipelineSummary>(
    Endpoints.analysisPipelinesCancel.replace(":id", id)
  );
  return response.data;
}

export async function fetchPipelineStatus(id: string) {
  const response = await apiClient.get<PipelineStatusResponse>(
    Endpoints.analysisPipelinesStatus.replace(":id", id)
  );
  return response.data;
}

export async function fetchPipelineRecommendations(id: string) {
  const response = await apiClient.get<RecommendationsResponse>(
    Endpoints.analysisPipelinesRecommendations.replace(":id", id)
  );
  return response.data;
}
