import { RoleGuard } from "@/app/(dashboard)/_guards/role-guard";
import type { ReactNode } from "react";

type SuperAdminLayoutProps = {
  children: ReactNode;
};

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return <RoleGuard allowedRoles={["SUPER_ADMIN"]}>{children}</RoleGuard>;
}
