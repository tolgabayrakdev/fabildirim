import AuthProvider from "@/providers/auth-provider";
import { Outlet } from "react-router";


export default function DashboardLayout() {
    return (
        <AuthProvider>
                <Outlet />
        </AuthProvider>
    );
}
