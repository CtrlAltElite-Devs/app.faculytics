"use client"

import * as React from "react"
import Link from "next/link"

import { AppBrand } from "@/components/layout/app-brand"
import { useActiveRole } from "@/features/auth/hooks/use-active-role"
import { getNavItemsForRole, getRoleConfig } from "@/features/auth/lib/role-route"
import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
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
              <Link href={logoHref} className="flex items-center gap-2">
                <AppBrand
                  logoClassName="size-5"
                  textClassName="text-sm group-data-[collapsible=icon]:hidden"
                  className="min-w-0 flex-1"
                />
                <div className="grid text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
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
