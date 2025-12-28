import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore, useIsAuthenticated } from "@/store/auth-store";
import Loading from "@/components/loading";

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const navigate = useNavigate();
    const { loading, checkAuth } = useAuthStore();
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        checkAuth().then((authenticated) => {
            if (!authenticated) {
                navigate("/sign-in", { replace: true });
            }
        });
    }, [navigate, checkAuth]);

    if (loading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return null; // Redirect işlemi devam ediyor
    }

    return <>{children}</>;
}