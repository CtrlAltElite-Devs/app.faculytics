export const QUESTIONNAIRE_TYPE_MANAGEMENT_FILTERS = ["ALL", "SYSTEM", "CUSTOM"] as const;

export type QuestionnaireTypeManagementFilter =
  (typeof QUESTIONNAIRE_TYPE_MANAGEMENT_FILTERS)[number];

export const QUESTIONNAIRE_TYPE_MANAGEMENT_FILTER_LABELS = {
  ALL: "All types",
  SYSTEM: "System types",
  CUSTOM: "Custom types",
} as const satisfies Record<QuestionnaireTypeManagementFilter, string>;
