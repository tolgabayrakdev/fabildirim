import { createBrowserRouter } from "react-router";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";

import DashboardLayout from "@/layouts/dashboard-layout";
import DashboardIndex from "@/pages/dashboard";
import Settings from "@/pages/dashboard/settings";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import NotFound from "@/pages/not-found";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <DashboardIndex />
            },
            {
                path: "/settings",
                element: <Settings />
            }
        ]

    },
    {
        path: "/sign-in",
        element: <SignIn />
    },
    {
        path: "/sign-up",
        element: <SignUp />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
    {
        path: "*",
        element: <NotFound />
    }
]);