"use client";

import { ChevronDown } from "lucide-react";

import type { AppRole } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { useActiveRole } from "@/features/auth/hooks/use-active-role";
import { getRoleLabel } from "@/features/auth/lib/role-route";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RoleSwitcher() {
  const { activeRole, availableRoles, setActiveRole } = useActiveRole();

  if (!activeRole || availableRoles.length < 2) {
    return null;
  }

  const handleRoleChange = (nextRole: string) => {
    const nextActiveRole = nextRole as AppRole;

    if (nextRole === activeRole) return;

    setActiveRole(nextActiveRole);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-[8.5rem] justify-between">
          <span>{getRoleLabel(activeRole)}</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[8.5rem] min-w-0">
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
