"use client"

import * as React from "react"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

import { useActiveRole } from "@/hooks/auth/use-active-role"
import { getNavItemsForRole, getRoleConfig } from "@/lib/auth/role-route"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeRole, roleHome } = useActiveRole()
  const navItems = getNavItemsForRole(activeRole)
  const logoHref = roleHome ?? "/"
  const roleLabel = activeRole ? getRoleConfig(activeRole).label : null

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={logoHref}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-brand-blue text-sidebar-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Faculytics</span>
                  {roleLabel ? (
                    <span className="truncate text-xs text-muted-foreground">{roleLabel} Mode</span>
                  ) : null}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
