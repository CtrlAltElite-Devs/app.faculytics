import { BarChart3, BookOpen, Building2, LayoutDashboard, Shield, type LucideIcon } from "lucide-react";

import { ROLES, type AppRole } from "@/constants/roles";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type RoleConfig = {
  label: string;
  homePath: string;
  routePrefix: string;
  navItems: NavItem[];
};

const ROLE_CONFIG: Record<AppRole, RoleConfig> = {
  STUDENT: {
    label: "Student",
    homePath: "/student/courses",
    routePrefix: "/student",
    navItems: [{ title: "Courses", url: "/student/courses", icon: BookOpen }],
  },
  FACULTY: {
    label: "Faculty",
    homePath: "/faculty/courses",
    routePrefix: "/faculty",
    navItems: [
      { title: "Courses", url: "/faculty/courses", icon: BookOpen },
      { title: "Analytics", url: "/faculty/analytics", icon: BarChart3 },
    ],
  },
  DEAN: {
    label: "Dean",
    homePath: "/dean",
    routePrefix: "/dean",
    navItems: [
      { title: "Dashboard", url: "/dean", icon: LayoutDashboard },
      { title: "Faculties", url: "/dean/faculties", icon: Building2 },
    ],
  },
  ADMIN: {
    label: "Admin",
    homePath: "/admin",
    routePrefix: "/admin",
    navItems: [{ title: "Admin", url: "/admin", icon: Shield }],
  },
  SUPER_ADMIN: {
    label: "Super Admin",
    homePath: "/superadmin/questionnaires",
    routePrefix: "/superadmin",
    navItems: [{ title: "Questionnaires", url: "/superadmin/questionnaires", icon: Shield }],
  },
};

export function getAvailableRoles(roles?: string[] | null): AppRole[] {
  if (!roles?.length) return [];

  return ROLES.filter((role) => roles.includes(role));
}

export function resolveActiveRole(
  roles?: string[] | null,
  activeRole?: AppRole | null,
) {
  const availableRoles = getAvailableRoles(roles);
  if (!availableRoles.length) return null;

  if (activeRole && availableRoles.includes(activeRole)) {
    return activeRole;
  }

  return availableRoles[0];
}

export function resolveHomeFromRoles(
  roles?: string[] | null,
  activeRole?: AppRole | null,
) {
  const role = resolveActiveRole(roles, activeRole);
  return role ? ROLE_CONFIG[role].homePath : null;
}

export function getRoleConfig(role: AppRole) {
  return ROLE_CONFIG[role];
}

export function getRoleLabel(role: AppRole) {
  return ROLE_CONFIG[role].label;
}

export function getNavItemsForRole(role: AppRole | null) {
  return role ? ROLE_CONFIG[role].navItems : [];
}

export function getRoutePrefixForRole(role: AppRole) {
  return ROLE_CONFIG[role].routePrefix;
}

export function getRoleFromPathname(pathname: string): AppRole | null {
  const match = ROLES.find((role) => {
    const routePrefix = ROLE_CONFIG[role].routePrefix;
    return pathname === routePrefix || pathname.startsWith(`${routePrefix}/`);
  });

  return match ?? null;
}
