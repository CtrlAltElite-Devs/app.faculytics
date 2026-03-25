import { RoleGuard } from "@/app/(dashboard)/_guards/role-guard";
import { APP_ROLES } from "@/constants/roles";
import type { ReactNode } from "react";

type DeanLayoutProps = {
  children: ReactNode;
};

export default function DeanLayout({ children }: DeanLayoutProps) {
  return <RoleGuard allowedRoles={[APP_ROLES.DEAN]}>{children}</RoleGuard>;
}
