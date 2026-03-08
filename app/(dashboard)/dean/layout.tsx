import { RoleGuard } from "@/app/(dashboard)/_guards/role-guard";
import type { ReactNode } from "react";

type DeanLayoutProps = {
  children: ReactNode;
};

export default function DeanLayout({ children }: DeanLayoutProps) {
  return <RoleGuard allowedRoles={["DEAN"]}>{children}</RoleGuard>;
}
