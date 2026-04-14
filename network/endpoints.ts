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
  analyticsFacultyReport = "/api/v1/analytics/faculty/:facultyId/report",
  analyticsFacultyReportComments = "/api/v1/analytics/faculty/:facultyId/report/comments",
  reportsGenerate = "/api/v1/reports/generate",
  reportsGenerateBatch = "/api/v1/reports/generate/batch",
  reportsStatus = "/api/v1/reports/status/:jobId",
  reportsBatchStatus = "/api/v1/reports/batch/:batchId",

  // Faculty
  faculty = "/api/v1/faculty",
  facultyEnrollments = "/api/v1/faculty/:facultyId/enrollments",

  // Analysis Pipeline (FAC-132). `analysisPipelines` covers both the list
  // (GET) and create (POST) calls since they share the same URL; HTTP verb
  // distinguishes them at the call site.
  analysisPipelines = "/api/v1/analysis/pipelines",
  analysisPipelinesConfirm = "/api/v1/analysis/pipelines/:id/confirm",
  analysisPipelinesCancel = "/api/v1/analysis/pipelines/:id/cancel",
  analysisPipelinesStatus = "/api/v1/analysis/pipelines/:id/status",
  analysisPipelinesRecommendations = "/api/v1/analysis/pipelines/:id/recommendations",
}
