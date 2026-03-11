export enum Endpoints {
  // Auth
  login = "/api/v1/auth/login",
  me = "/api/v1/auth/me",
  refresh = "/api/v1/auth/refresh",
  logout = "/api/v1/auth/logout",

  // Student
  enrollmentsMe = "/api/v1/enrollments/me",

  // Questionnaires
  questionnaireTypes = "/api/v1/questionnaires/types",
  questionnaireTypeVersions = "/api/v1/questionnaires/types/:type/versions",
}
