import {
  BarChart3,
  BookOpen,
  Building2,
  ChartNoAxesColumn,
  LayoutDashboard,
  ListChecks,
  NotebookPen,
  Shield,
  Tags,
  type LucideIcon,
} from "lucide-react";

import { APP_ROLES, ROLES, type AppRole } from "@/constants/roles";

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
  [APP_ROLES.STUDENT]: {
    label: "Student",
    homePath: "/student/courses",
    routePrefix: "/student",
    navItems: [{ title: "Courses", url: "/student/courses", icon: BookOpen }],
  },
  [APP_ROLES.FACULTY]: {
    label: "Faculty",
    homePath: "/faculty/analytics",
    routePrefix: "/faculty",
    navItems: [{ title: "Analytics", url: "/faculty/analytics", icon: BarChart3 }],
  },
  [APP_ROLES.DEAN]: {
    label: "Dean",
    homePath: "/dean/dashboard",
    routePrefix: "/dean",
    navItems: [
      { title: "Dashboard", url: "/dean/dashboard", icon: LayoutDashboard },
      { title: "Faculty", url: "/dean/faculty", icon: ChartNoAxesColumn },
      { title: "Evaluation", url: "/dean/evaluation", icon: NotebookPen },
    ],
  },
  [APP_ROLES.CHAIRPERSON]: {
    label: "Chairperson",
    homePath: "/chairperson/dashboard",
    routePrefix: "/chairperson",
    navItems: [
      { title: "Dashboard", url: "/chairperson/dashboard", icon: LayoutDashboard },
      { title: "Faculty", url: "/chairperson/faculty", icon: Building2 },
      { title: "Evaluation", url: "/chairperson/evaluation", icon: NotebookPen },
    ],
  },
  [APP_ROLES.CAMPUS_HEAD]: {
    label: "Campus Head",
    homePath: "/campus-head/dashboard",
    routePrefix: "/campus-head",
    navItems: [
      { title: "Dashboard", url: "/campus-head/dashboard", icon: LayoutDashboard },
      { title: "Faculty", url: "/campus-head/faculty", icon: ChartNoAxesColumn },
    ],
  },
  [APP_ROLES.ADMIN]: {
    label: "Admin",
    homePath: "/admin",
    routePrefix: "/admin",
    navItems: [{ title: "Admin", url: "/admin", icon: Shield }],
  },
  [APP_ROLES.SUPER_ADMIN]: {
    label: "Super Admin",
    homePath: "/superadmin/questionnaires",
    routePrefix: "/superadmin",
    navItems: [
      {
        title: "Questionnaires",
        url: "/superadmin/questionnaires",
        icon: Shield,
      },
      {
        title: "Dimensions",
        url: "/superadmin/dimensions",
        icon: Tags,
      },
      {
        title: "Questionnaire Types",
        url: "/superadmin/questionnaire-types",
        icon: ListChecks,
      },
    ],
  },
};

export function getAvailableRoles(roles?: readonly string[] | null): AppRole[] {
  if (!roles?.length) return [];

  return ROLES.filter((role) => roles.includes(role));
}

export function resolveActiveRole(roles?: readonly AppRole[] | null, activeRole?: AppRole | null) {
  const resolvedRoles = roles ?? [];
  if (!resolvedRoles.length) return null;

  if (activeRole && resolvedRoles.includes(activeRole)) {
    return activeRole;
  }

  return resolvedRoles[0];
}

export function resolveHomeFromRoles(
  roles?: readonly AppRole[] | null,
  activeRole?: AppRole | null
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
