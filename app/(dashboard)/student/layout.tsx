import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/role-guard";

type StudentLayoutProps = {
  children: ReactNode;
};

export default function StudentLayout({ children }: StudentLayoutProps) {
  return <RoleGuard allowedRoles={["STUDENT"]}>{children}</RoleGuard>;
}
