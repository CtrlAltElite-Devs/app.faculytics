"use client"

import * as React from "react"
import { BarChart3, BookOpen, Building2, GraduationCap } from "lucide-react"
import Link from "next/link"

import { useMe } from "@/hooks/auth/use-me"
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

const data = {
  navMain: [
    {
      title: "Courses",
      url: "/student/courses",
      allowedRoles: ["STUDENT", "FACULTY"],
      icon: BookOpen,
    },
    {
      title: "Analytics",
      url: "/faculty/analytics",
      allowedRoles: ["FACULTY"],
      icon: BarChart3,
    },
    {
      title: "Faculties",
      url: "/dean/faculties",
      allowedRoles: ["DEAN"],
      icon: Building2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: me } = useMe()
  const roles = me?.roles ?? []
  const navItems = data.navMain.filter((item) =>
    item.allowedRoles.some((role) => roles.includes(role)),
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/student/courses">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Faculytics</span>
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
