import { makeServer } from "../server/mirage";
import { AppRouter } from "./app/router/AppRouter";
import { store } from "./store/store";
import "./styles/app.css";
import { setUnauthorizedHandler } from "./api/http";
import { logout } from "./store/authSlice";
import { ACCESS_TOKEN_COOKIE } from "./shared/constants/auth";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

makeServer();

setUnauthorizedHandler(() => {
    store.dispatch(logout());
    document.cookie = `${ACCESS_TOKEN_COOKIE}=; Max-Age=0; path=/`;
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <AppRouter />
        </Provider>
    </StrictMode>,
);
