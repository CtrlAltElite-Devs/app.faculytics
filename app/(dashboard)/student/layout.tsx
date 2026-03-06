import { RoleGuard } from "@/components/auth/role-guard";
import type { ReactNode } from "react";

type StudentLayoutProps = {
  children: ReactNode;
};

export default function StudentLayout({ children }: StudentLayoutProps) {
  return <RoleGuard allowedRoles={["STUDENT"]}>{children}</RoleGuard>;
}
