import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { LOGIN_ROUTE } from "../../shared/constants/routes";

export function ProtectedRoute() {
    const isAuth = useAppSelector((s) => s.auth.isAuth);

    if (isAuth) return <Outlet />;
    return <Navigate to={LOGIN_ROUTE} replace />;
}
