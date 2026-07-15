import { useEffect, useState } from "react"

type FetchState<T> = {
    data?: T| null,
    loading: boolean,
    error?: string| null
}

export default function UseFetch<T>(url: string): FetchState<T> {

    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(url)
        .then(async res => {
            if (!res.ok)
                return setError(await res.text())
            res.json();
        })
        .then(json => setData(json as T))
        .finally(() => setLoading(false));
    }, [url]);

    return { data, loading, error }

}