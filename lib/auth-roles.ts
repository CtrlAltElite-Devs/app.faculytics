const STUDENT_ROLE = "STUDENT";
const FACULTY_ROLE = "FACULTY";
// const DEAN_ROLE = "DEAN";
// const ADMIN_ROLE = "ADMIN";
// const SUPER_ADMIN_ROLE = "SUPER_ADMIN";

export function hasRole(roles: string[], role: string) {
  return roles.includes(role);
}

export function resolveHomePathFromRoles(roles: string[]) {
  if (hasRole(roles, STUDENT_ROLE)) {
    return "/student/courses";
  }

  if (hasRole(roles, FACULTY_ROLE)) {
    return "/faculty/courses";
  }

  // if (hasRole(roles, DEAN_ROLE)) return "/faculty/analytics";
  // if (hasRole(roles, ADMIN_ROLE)) return "/faculty/analytics";
  // if (hasRole(roles, SUPER_ADMIN_ROLE)) return "/faculty/analytics";

  return "/auth";
}
