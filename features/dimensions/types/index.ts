import type { QuestionnaireTypeEntity } from "@/features/questionnaires/types";

export type Dimension = {
  id: string;
  code: string;
  displayName: string;
  questionnaireType: QuestionnaireTypeEntity;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DimensionsListMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  itemCount: number;
};

export type DimensionsListResponse = {
  data: Dimension[];
  meta: DimensionsListMeta;
};

export type ListDimensionsRequest = {
  questionnaireTypeId?: string;
  active?: boolean;
  page?: number;
  limit?: number;
};

export type CreateDimensionRequest = {
  displayName: string;
  questionnaireTypeId: string;
  code?: string;
};

export type UpdateDimensionRequest = {
  displayName: string;
};
