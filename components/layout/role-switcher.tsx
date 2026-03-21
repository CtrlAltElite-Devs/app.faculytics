"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import type { AppRole } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { useActiveRole, getRoleConfig, getRoleLabel } from "@/features/auth";
import { useAuthStore } from "@/stores/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RoleSwitcherProps = {
  align?: "start" | "center" | "end";
  className?: string;
};

export function RoleSwitcher({ align = "end", className }: RoleSwitcherProps) {
  const router = useRouter();
  const { activeRole, availableRoles, setActiveRole } = useActiveRole();
  const setPendingRoleHome = useAuthStore((state) => state.setPendingRoleHome);

  if (!activeRole || !availableRoles.length) {
    return null;
  }

  const handleRoleChange = (nextRole: string) => {
    const nextActiveRole = nextRole as AppRole;
    const nextHomePath = getRoleConfig(nextActiveRole).homePath;

    if (nextActiveRole === activeRole) {
      return;
    }

    setPendingRoleHome(nextHomePath);
    setActiveRole(nextActiveRole);
    router.replace(nextHomePath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className ?? "min-w-32 justify-between"}>
          <span>{getRoleLabel(activeRole)}</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-40">
        <DropdownMenuRadioGroup value={activeRole} onValueChange={handleRoleChange}>
          {availableRoles.map((role) => (
            <DropdownMenuRadioItem key={role} value={role}>
              {getRoleLabel(role)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
