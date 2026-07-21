import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

interface UseFetchResult<T> {
    data: T | null,
    isLoading: boolean,
    error: string | null,
    setData: Dispatch<SetStateAction<T | null>>;
}

export function useFetch<T>(
    fetcher: () => Promise<T>,
    deps: unknown[] = []
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        fetcher()
            .then(setData)
            .catch(err => { 
                setError(err instanceof Error ? err.message : "failed to fetch");
            })
            .finally(() => setIsLoading(false));
    }, deps);

    return { data, isLoading, error, setData};
}