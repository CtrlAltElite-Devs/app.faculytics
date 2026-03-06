import { ROLES } from "@/constants/roles";

const ROLE_HOME_PATH: Record<(typeof ROLES)[number], string> = {
  STUDENT: "/student/courses",
  FACULTY: "/faculty/courses",
  DEAN: "/dean/faculties",
  ADMIN: "/admin",
  SUPER_ADMIN: "/superadmin",
};

export function resolveHomeFromRoles(roles?: string[] | null) {
  if (!roles?.length) return null;

  const match = ROLES.find((role) => roles.includes(role));
  return match ? ROLE_HOME_PATH[match] : null;
}
