export const QUESTIONNAIRE_TYPES = [
  "FACULTY_FEEDBACK",
  "FACULTY_IN_CLASSROOM",
  "FACULTY_OUT_OF_CLASSROOM",
] as const;

export const QUESTIONNAIRE_STATUSES = ["DRAFT", "ACTIVE", "DEPRECATED"] as const;

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

export const DEFAULT_QUESTIONNAIRE_TYPE: QuestionnaireType = "FACULTY_FEEDBACK";

export const QUESTIONNAIRE_TYPE_LABELS: Record<QuestionnaireType, string> = {
  FACULTY_IN_CLASSROOM: "Faculty In Classroom",
  FACULTY_OUT_OF_CLASSROOM: "Faculty Out of Classroom",
  FACULTY_FEEDBACK: "Faculty Feedback",
};

export const QUESTIONNAIRE_STATUS_FILTER_LABELS: Record<QuestionnaireStatusFilter, string> = {
  ALL: "All statuses",
  DRAFT: "Draft",
  ACTIVE: "Active",
  DEPRECATED: "Deprecated",
};
