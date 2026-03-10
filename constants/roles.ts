export const ROLES = ["STUDENT", "FACULTY", "DEAN", "ADMIN", "SUPER_ADMIN"] as const;

export type AppRole = (typeof ROLES)[number];
