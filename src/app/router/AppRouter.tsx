import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LOGIN_ROUTE, TODOS_ROUTE } from "../../shared/constants/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { FallbackRedirect } from "./FallbackRedirect";

const router = createBrowserRouter(
    [
        {
            path: LOGIN_ROUTE,
            async lazy() {
                const m = await import("../../pages/LoginPage/LoginPage");
                return { Component: m.LoginPage };
            },
        },

        {
            Component: ProtectedRoute,
            children: [
                {
                    path: TODOS_ROUTE,
                    async lazy() {
                        const m =
                            await import("../../pages/TodosPage/TodosPage");
                        return { Component: m.TodosPage };
                    },
                },
            ],
        },

        {
            path: "*",
            Component: FallbackRedirect,
        },
    ],
    {
        future: { v7_relativeSplatPath: true },
    },
);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
