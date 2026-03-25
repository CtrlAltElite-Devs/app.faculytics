import { RoleGuard } from "@/app/(dashboard)/_guards/role-guard";
import { APP_ROLES } from "@/constants/roles";
import type { ReactNode } from "react";

type SuperAdminLayoutProps = {
  children: ReactNode;
};

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return <RoleGuard allowedRoles={[APP_ROLES.SUPER_ADMIN]}>{children}</RoleGuard>;
}
