import { useState } from "react";

export function App() {
    const [ping, setPing] = useState<string>("не запрашивал");

    const onPing = async () => {
        console.log("[ui] ping click");
        const res = await fetch("/api/ping");
        const data = await res.json();
        console.log("[ui] ping response", data);
        setPing(JSON.stringify(data));
    };

    return (
        <div>
            todo-React (Webpack + TS)
            <button onClick={onPing}>Ping</button>
        </div>
    );
}
