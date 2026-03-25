import { RoleGuard } from "@/app/(dashboard)/_guards/role-guard";
import { APP_ROLES } from "@/constants/roles";
import type { ReactNode } from "react";

type StudentLayoutProps = {
  children: ReactNode;
};

export default function StudentLayout({ children }: StudentLayoutProps) {
  return <RoleGuard allowedRoles={[APP_ROLES.STUDENT]}>{children}</RoleGuard>;
}
