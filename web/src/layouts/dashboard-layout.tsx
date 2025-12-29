import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AuthProvider from "@/providers/auth-provider";
import { Outlet } from "react-router";


export default function DashboardLayout() {
    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    );
}
