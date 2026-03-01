import type { ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardContentHeader } from "@/components/dashboard-content-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardContentHeader />
          <main className="flex flex-1 flex-col p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
