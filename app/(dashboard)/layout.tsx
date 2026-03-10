import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/app/(dashboard)/_guards/auth-guard";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col px-4 py-4 md:px-0 md:py-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
