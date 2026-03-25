import type { ReactNode } from "react";

import { RoleGuard } from "@/app/(dashboard)/_guards/role-guard";
import { APP_ROLES } from "@/constants/roles";

type ChairpersonLayoutProps = {
  children: ReactNode;
};

export default function ChairpersonLayout({ children }: ChairpersonLayoutProps) {
  return <RoleGuard allowedRoles={[APP_ROLES.CHAIRPERSON]}>{children}</RoleGuard>;
}
