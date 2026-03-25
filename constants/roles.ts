export const APP_ROLES = {
  STUDENT: "STUDENT",
  FACULTY: "FACULTY",
  DEAN: "DEAN",
  CHAIRPERSON: "CHAIRPERSON",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export const ROLES = Object.values(APP_ROLES) as AppRole[];
