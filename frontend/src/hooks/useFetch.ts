import { useEffect, useState } from "react";
import api from "../lib/api";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get<T>(url)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data. Please check your connection.");
        setLoading(false);
      });
  }, [url, tick]);

  const refetch = () => setTick((t) => t + 1);

  return { data, loading, error, refetch };
}
