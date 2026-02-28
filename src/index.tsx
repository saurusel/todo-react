import { makeServer } from "../server/mirage";
import { AppRouter } from "./app/router/AppRouter";
import { store } from "./store/store";
import "./styles/app.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

makeServer();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <AppRouter />
        </Provider>
    </StrictMode>,
);