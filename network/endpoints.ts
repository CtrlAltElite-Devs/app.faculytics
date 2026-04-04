export enum Endpoints {
  // Auth
  login = "/api/v1/auth/login",
  me = "/api/v1/auth/me",
  refresh = "/api/v1/auth/refresh",
  logout = "/api/v1/auth/logout",

  // Student
  enrollmentsMe = "/api/v1/enrollments/me",

  // Semesters
  semesters = "/api/v1/semesters",

  // Curriculum
  curriculumPrograms = "/api/v1/curriculum/programs",

  // Questionnaires
  questionnaires = "/api/v1/questionnaires",
  questionnaireTypes = "/api/v1/questionnaires/types",
  questionnaireTypeVersions = "/api/v1/questionnaires/types/:type/versions",
  questionnaireVersions = "/api/v1/questionnaires/:id/versions",
  questionnaireVersionById = "/api/v1/questionnaires/versions/:versionId",
  questionnaireLatestActiveVersion = "/api/v1/questionnaires/:id/latest-active-version",
  questionnaireVersionPublish = "/api/v1/questionnaires/versions/:versionId/publish",
  questionnaireVersionDeprecate = "/api/v1/questionnaires/versions/:versionId/deprecate",
  questionnaireVersionFromTemplate = "/api/v1/questionnaires/:id/versions/from-template",

  // Questionnaire Submissions
  questionnaireSubmissions = "/api/v1/questionnaires/submissions",
  questionnaireSubmissionsCheck = "/api/v1/questionnaires/submissions/check",

  // Questionnaire Drafts
  questionnaireDrafts = "/api/v1/questionnaires/drafts",
  questionnaireDraftsList = "/api/v1/questionnaires/drafts/list",

  // Questionnaire Types (entity CRUD)
  questionnaireTypeEntities = "/api/v1/questionnaire-types",
  questionnaireTypeEntityById = "/api/v1/questionnaire-types/:id",

  // Dimensions
  dimensions = "/api/v1/dimensions",
  dimensionById = "/api/v1/dimensions/:id",
  dimensionActivate = "/api/v1/dimensions/:id/activate",
  dimensionDeactivate = "/api/v1/dimensions/:id/deactivate",

  // Faculty Analytics
  analyticsOverview = "/api/v1/analytics/overview",
  analyticsAttention = "/api/v1/analytics/attention",

  // Faculty
  faculty = "/api/v1/faculty",
}
