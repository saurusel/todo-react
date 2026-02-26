import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LOGIN_ROUTE, TODOS_ROUTE } from "../../shared/constants/routes";
import { LoginPage } from "../../pages/LoginPage/LoginPage";
import { TodosPage } from "../../pages/TodosPage/TodosPage";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to={TODOS_ROUTE} replace />}
                />
                <Route path={LOGIN_ROUTE} element={<LoginPage />} />
                <Route path={TODOS_ROUTE} element={<TodosPage />} />
                <Route
                    path="*"
                    element={<Navigate to={TODOS_ROUTE} replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}
