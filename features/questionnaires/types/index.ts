import {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_STATUSES,
  QUESTIONNAIRE_STATUS_FILTER_LABELS,
  QUESTIONNAIRE_TYPES,
  QUESTIONNAIRE_TYPE_LABELS,
} from "@/features/questionnaires/constants";
import type { QuestionnaireVersionSchema } from "@/features/questionnaires/types/builder";

export type QuestionnaireType = (typeof QUESTIONNAIRE_TYPES)[number];

export type QuestionnaireStatus = (typeof QUESTIONNAIRE_STATUSES)[number];

export type QuestionnaireStatusFilter = QuestionnaireStatus | "ALL";

export type QuestionnaireTypeSummary = {
  type: QuestionnaireType;
  questionnaireId: string | null;
  title: string | null;
  status: QuestionnaireStatus | null;
};

export type QuestionnaireVersionItem = {
  id: string;
  versionNumber: number;
  status: QuestionnaireStatus;
  isActive: boolean;
  publishedAt?: string | null;
  createdAt: string;
};

export type QuestionnaireVersionsResponse = {
  questionnaireId: string | null;
  questionnaireTitle: string | null;
  type: QuestionnaireType;
  versions: QuestionnaireVersionItem[];
};

export type QuestionnaireVersionDetail = {
  id: string;
  questionnaireId: string;
  questionnaireTitle: string;
  questionnaireType: QuestionnaireType;
  versionNumber: number;
  status: QuestionnaireStatus;
  isActive: boolean;
  schemaSnapshot: QuestionnaireVersionSchema;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateQuestionnaireRequest = {
  title: string;
  type: QuestionnaireType;
};

export type Questionnaire = {
  id: string;
  title: string;
  status: QuestionnaireStatus;
  type: QuestionnaireType;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type CreateQuestionnaireVersionRequest = {
  schema: QuestionnaireVersionSchema;
};

export type UpdateQuestionnaireVersionRequest = {
  schema: QuestionnaireVersionSchema;
  title?: string;
};

export type QuestionnaireVersion = {
  id: string;
  questionnaire: Questionnaire;
  versionNumber: number;
  schemaSnapshot: QuestionnaireVersionSchema;
  publishedAt?: string | null;
  isActive: boolean;
  status: QuestionnaireStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export function resolveQuestionnaireType(value: string | null): QuestionnaireType {
  if (value && QUESTIONNAIRE_TYPES.includes(value as QuestionnaireType)) {
    return value as QuestionnaireType;
  }

  return DEFAULT_QUESTIONNAIRE_TYPE;
}

export * from "@/features/questionnaires/types/builder";
export {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_STATUSES,
  QUESTIONNAIRE_STATUS_FILTER_LABELS,
  QUESTIONNAIRE_TYPES,
  QUESTIONNAIRE_TYPE_LABELS,
};
