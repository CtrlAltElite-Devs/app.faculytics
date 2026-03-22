"use client"

import * as React from "react"
import Link from "next/link"

import { AppBrand } from "@/components/layout/app-brand"
import { RoleSwitcher } from "@/components/layout/role-switcher"
import { useActiveRole, getNavItemsForRole } from "@/features/auth"
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
  SidebarSeparator,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeRole, roleHome } = useActiveRole()
  const navItems = getNavItemsForRole(activeRole)
  const logoHref = roleHome ?? "/"

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
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 pb-2 md:hidden">
          <RoleSwitcher className="w-full justify-between" />
        </div>
        <SidebarSeparator className="md:hidden" />
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
