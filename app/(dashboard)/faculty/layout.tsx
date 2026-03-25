import { RoleGuard } from "@/app/(dashboard)/_guards/role-guard";
import { APP_ROLES } from "@/constants/roles";
import type { ReactNode } from "react";

type FacultyLayoutProps = {
  children: ReactNode;
};

export default function FacultyLayout({ children }: FacultyLayoutProps) {
  return <RoleGuard allowedRoles={[APP_ROLES.FACULTY]}>{children}</RoleGuard>;
}
