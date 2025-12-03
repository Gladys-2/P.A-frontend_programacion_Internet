import { useState, useEffect } from "react";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useFetch<T>(url: string, config?: AxiosRequestConfig): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<T>(url, config);
      setData(response.data);
    } catch (err: any) {
      console.error("Error en useFetch:", err);
      setError(err.response?.status ? `Error ${err.response.status}` : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}