import { RoleGuard } from "@/app/(dashboard)/_guards/role-guard";
import { APP_ROLES } from "@/constants/roles";
import type { ReactNode } from "react";

type CampusHeadLayoutProps = {
  children: ReactNode;
};

export default function CampusHeadLayout({ children }: CampusHeadLayoutProps) {
  return <RoleGuard allowedRoles={[APP_ROLES.CAMPUS_HEAD]}>{children}</RoleGuard>;
}
