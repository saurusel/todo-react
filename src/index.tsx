import { makeServer } from '../server/mirage';
import { AppRouter } from "./app/router/AppRouter";
import './styles/app.css';

import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { App } from "./App";

makeServer();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppRouter />
    </StrictMode>,
);
