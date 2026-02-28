import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LOGIN_ROUTE, TODOS_ROUTE } from "../../shared/constants/routes";
import { LoginPage } from "../../pages/LoginPage/LoginPage";
import { TodosPage } from "../../pages/TodosPage/TodosPage";
import { useAppSelector } from "../../store/hooks";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
    const isAuth = useAppSelector((s) => s.auth.isAuth);

    return (
        <BrowserRouter>
            <Routes>
                {isAuth ? (
                    <>
                        <Route
                            path="/"
                            element={<Navigate to={TODOS_ROUTE} replace />}
                        />

                        <Route element={<ProtectedRoute />}>
                            <Route path={TODOS_ROUTE} element={<TodosPage />} />
                        </Route>

                        <Route
                            path="*"
                            element={<Navigate to={TODOS_ROUTE} replace />}
                        />
                    </>
                ) : (
                    <>
                        <Route
                            path="/"
                            element={<Navigate to={LOGIN_ROUTE} replace />}
                        />
                        <Route path={LOGIN_ROUTE} element={<LoginPage />} />
                        <Route
                            path="*"
                            element={<Navigate to={LOGIN_ROUTE} replace />}
                        />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}
