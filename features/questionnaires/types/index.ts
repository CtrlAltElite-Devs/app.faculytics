import {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_STATUSES,
  QUESTIONNAIRE_STATUS_FILTER_LABELS,
  QUESTIONNAIRE_TYPES,
  QUESTIONNAIRE_TYPE_LABELS,
  getQuestionnaireTypeLabel,
} from "@/features/questionnaires/constants";
import type { QuestionnaireVersionSchema } from "@/features/questionnaires/types/builder";

export type QuestionnaireTypeCode = string;

export type QuestionnaireStatus = (typeof QUESTIONNAIRE_STATUSES)[number];

export type QuestionnaireStatusFilter = QuestionnaireStatus | "ALL";

export type QuestionnaireTypeEntity = {
  id: string;
  name: string;
  code: QuestionnaireTypeCode;
  description: string | null;
  isSystem: boolean;
};

export type QuestionnaireTypeManagementEntity = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
};

export type ListQuestionnaireTypeManagementRequest = {
  isSystem?: boolean;
};

export type CreateQuestionnaireTypeManagementRequest = {
  name: string;
  code: string;
  description?: string;
};

export type UpdateQuestionnaireTypeManagementRequest = {
  name?: string;
  description?: string;
};

export type DeleteQuestionnaireTypeManagementResponse = {
  message: string;
};

export type QuestionnaireTypeSummary = {
  id: string;
  name: string;
  code: QuestionnaireTypeCode;
  description: string | null;
  isSystem: boolean;
  questionnaireId: string | null;
  questionnaireTitle: string | null;
  questionnaireStatus: QuestionnaireStatus | null;
};

export type QuestionnaireVersionItem = {
  id: string;
  versionNumber: number;
  status: QuestionnaireStatus;
  isActive: boolean;
  publishedAt?: string | null;
  createdAt: string;
};

export type VersionLifecycleAction =
  | { type: "publish"; row: QuestionnaireVersionItem }
  | { type: "deprecate"; row: QuestionnaireVersionItem }
  | null;

export type QuestionnaireVersionsResponse = {
  questionnaireId: string | null;
  questionnaireTitle: string | null;
  type: QuestionnaireTypeEntity;
  versions: QuestionnaireVersionItem[];
};

export type QuestionnaireVersionDetail = {
  id: string;
  questionnaireId: string;
  questionnaireTitle: string;
  questionnaireType: QuestionnaireTypeEntity;
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
  typeId: string;
};

export type Questionnaire = {
  id: string;
  title: string;
  status: QuestionnaireStatus;
  type: QuestionnaireTypeEntity;
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

// --- Form renderer types ---

export type QuestionnaireFormMode = "preview" | "interactive";

export type QuestionnaireFormAnswers = Record<string, number>;

export type QuestionnaireFormValues = {
  answers: QuestionnaireFormAnswers;
  qualitativeComment: string;
};

// --- Submission / Draft types ---

export type SubmitEvaluationPayload = {
  versionId: string;
  respondentId: string;
  facultyId: string;
  semesterId: string;
  courseId?: string;
  answers: QuestionnaireFormAnswers;
  qualitativeComment?: string;
};

export type SaveDraftPayload = {
  versionId: string;
  facultyId: string;
  semesterId: string;
  courseId?: string;
  answers: QuestionnaireFormAnswers;
  qualitativeComment?: string;
};

export type FetchDraftParams = {
  versionId: string;
  facultyId: string;
  semesterId: string;
  courseId?: string;
};

export type DraftResponse = {
  id: string;
  versionId: string;
  facultyId: string;
  semesterId: string;
  courseId?: string;
  answers: QuestionnaireFormAnswers;
  qualitativeComment?: string;
  updatedAt: string;
};

export type CheckSubmissionParams = {
  versionId: string;
  facultyId: string;
  semesterId: string;
  courseId?: string;
};

export type CheckSubmissionResponse = {
  submitted: boolean;
  submittedAt?: string;
};

// --- Utility functions ---

export function resolveQuestionnaireType(value: string | null): QuestionnaireTypeCode {
  if (value && value.trim().length > 0) {
    return value;
  }

  return DEFAULT_QUESTIONNAIRE_TYPE;
}

export function isSeededQuestionnaireTypeCode(
  value: string
): value is (typeof QUESTIONNAIRE_TYPES)[number] {
  return QUESTIONNAIRE_TYPES.includes(value as (typeof QUESTIONNAIRE_TYPES)[number]);
}

export function resolveQuestionnaireTypeLabel(code: string, fallbackName?: string | null) {
  return getQuestionnaireTypeLabel(code, fallbackName);
}

export * from "@/features/questionnaires/types/builder";
export {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_STATUSES,
  QUESTIONNAIRE_STATUS_FILTER_LABELS,
  QUESTIONNAIRE_TYPES,
  QUESTIONNAIRE_TYPE_LABELS,
};
