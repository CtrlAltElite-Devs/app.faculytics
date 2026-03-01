import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/role-guard";

type FacultyLayoutProps = {
  children: ReactNode;
};

export default function FacultyLayout({ children }: FacultyLayoutProps) {
  return <RoleGuard allowedRoles={["FACULTY"]}>{children}</RoleGuard>;
}
