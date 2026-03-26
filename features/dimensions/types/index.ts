import type { QuestionnaireType } from "@/features/questionnaires/types";

export type Dimension = {
  id: string;
  code: string;
  displayName: string;
  questionnaireType: QuestionnaireType;
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
  questionnaireType?: QuestionnaireType;
  active?: boolean;
  page?: number;
  limit?: number;
};

export type CreateDimensionRequest = {
  displayName: string;
  questionnaireType: QuestionnaireType;
  code?: string;
};

export type UpdateDimensionRequest = {
  displayName: string;
};
