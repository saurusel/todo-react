import { useEffect, useState } from "react";

export function useDebouncedState<T>(initial: T, delayMs: number) {
    const [value, setValue] = useState<T>(initial);
    const [debounced, setDebounced] = useState<T>(initial);

    useEffect(() => {
        const id = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(id);
    }, [value, delayMs]);

    return { value, setValue, debounced };
}
