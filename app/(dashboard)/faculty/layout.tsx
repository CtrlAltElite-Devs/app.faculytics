import { RoleGuard } from "@/app/(dashboard)/_guards/role-guard";
import type { ReactNode } from "react";

type FacultyLayoutProps = {
  children: ReactNode;
};

export default function FacultyLayout({ children }: FacultyLayoutProps) {
  return <RoleGuard allowedRoles={["FACULTY"]}>{children}</RoleGuard>;
}
