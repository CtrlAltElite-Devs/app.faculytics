export enum Endpoints {
  // Auth
  login = "/api/v1/auth/login",
  me = "/api/v1/auth/me",
  refresh = "/api/v1/auth/refresh",
  logout = "/api/v1/auth/logout",

  // Student
  enrollmentsMe = "/api/v1/enrollments/me",

  // Questionnaires
  questionnaires = "/api/v1/questionnaires",
  questionnaireTypes = "/api/v1/questionnaires/types",
  questionnaireTypeVersions = "/api/v1/questionnaires/types/:type/versions",
  questionnaireVersions = "/api/v1/questionnaires/:id/versions",
  questionnaireVersionById = "/api/v1/questionnaires/versions/:versionId",
  questionnaireLatestActiveVersion = "/api/v1/questionnaires/:id/latest-active-version",
  questionnaireVersionPublish = "/api/v1/questionnaires/versions/:versionId/publish",
  questionnaireVersionDeprecate = "/api/v1/questionnaires/versions/:versionId/deprecate",

  // Questionnaire Submissions
  questionnaireSubmissions = "/api/v1/questionnaires/submissions",
  questionnaireSubmissionsCheck = "/api/v1/questionnaires/submissions/check",

  // Questionnaire Drafts
  questionnaireDrafts = "/api/v1/questionnaires/drafts",
  questionnaireDraftsList = "/api/v1/questionnaires/drafts/list",

  // Dimensions
  dimensions = "/api/v1/dimensions",
  dimensionById = "/api/v1/dimensions/:id",
  dimensionActivate = "/api/v1/dimensions/:id/activate",
  dimensionDeactivate = "/api/v1/dimensions/:id/deactivate",
}
