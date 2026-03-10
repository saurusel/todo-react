import { Navigate } from "react-router-dom";
import { LOGIN_ROUTE, TODOS_ROUTE } from "../../shared/constants/routes";
import { useAppSelector } from "../../store/hooks";

export function FallbackRedirect() {
    const isAuth = useAppSelector((s) => s.auth.isAuth);
    return <Navigate to={isAuth ? TODOS_ROUTE : LOGIN_ROUTE} replace />;
}
