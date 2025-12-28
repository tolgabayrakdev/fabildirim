import { createBrowserRouter } from "react-router";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";

import DashboardLayout from "@/layouts/dashboard-layout";
import Settings from "@/pages/dashboard/settings";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
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
    }
]);