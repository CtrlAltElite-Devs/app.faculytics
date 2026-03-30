export const QUESTIONNAIRE_TYPES = [
  "FACULTY_FEEDBACK",
  "FACULTY_IN_CLASSROOM",
  "FACULTY_OUT_OF_CLASSROOM",
] as const;

export const QUESTIONNAIRE_STATUSES = ["DRAFT", "ACTIVE", "DEPRECATED"] as const;

export const DEFAULT_QUESTIONNAIRE_TYPE = "FACULTY_FEEDBACK";

export const QUESTIONNAIRE_TYPE_LABELS = {
  FACULTY_IN_CLASSROOM: "Faculty In Classroom",
  FACULTY_OUT_OF_CLASSROOM: "Faculty Out of Classroom",
  FACULTY_FEEDBACK: "Faculty Feedback",
} as const satisfies Record<(typeof QUESTIONNAIRE_TYPES)[number], string>;

export const QUESTIONNAIRE_STATUS_FILTER_LABELS = {
  ALL: "All statuses",
  DRAFT: "Draft",
  ACTIVE: "Active",
  DEPRECATED: "Deprecated",
} as const satisfies Record<(typeof QUESTIONNAIRE_STATUSES)[number] | "ALL", string>;
