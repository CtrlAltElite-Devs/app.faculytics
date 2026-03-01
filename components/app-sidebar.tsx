"use client"

import type { ComponentProps, ComponentType } from "react"
import { BarChart3, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useMe } from "@/hooks/api/use-me"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  href: string
  icon: ComponentType<{ className?: string }>
}

const studentNavItems: NavItem[] = [
  {
    title: "Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
]

const facultyNavItems: NavItem[] = [
  {
    title: "Courses",
    href: "/faculty/courses",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    href: "/faculty/analytics",
    icon: BarChart3,
  },
]

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data } = useMe()
  const isFaculty = pathname.startsWith("/faculty")
  const roleLabel = isFaculty ? "Faculty" : "Student"
  const navItems = isFaculty ? facultyNavItems : studentNavItems
  const userName = data?.fullName?.trim() || data?.userName || "User"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:p-0">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
            <GraduationCap className="size-4" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold leading-none">Faculytics</p>
            <p className="text-sidebar-foreground/70 text-xs">{roleLabel}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{roleLabel} Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                  }
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userName,
            email: data?.userName,
            avatar: data?.userProfilePicture ?? "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
