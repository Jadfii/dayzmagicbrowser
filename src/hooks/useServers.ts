import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import http from '../services/HTTP';
import { Server } from '../types/Types';

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  return await http(input, init).then((res) => res.json());
}

export default function useServers(initialData?: Server[]): {
  serverList: Server[];
  isLoading: boolean;
  isError: boolean;
} {
  const router = useRouter();
  const [queryString, setQueryString] = useState<string>('');

  const { data, error } = useSWR<Server[]>(`/api/servers${queryString ? `?${queryString}` : ''}`, fetcher, {
    ...(initialData ? { fallbackData: initialData } : {}),
    isPaused: () => !router?.isReady,
  });

  useEffect(() => {
    if (!router?.isReady || !router?.query) return;

    const searchParams = new URLSearchParams();

    Object.entries(router.query).forEach(([key, val]) => {
      if (typeof val === 'undefined' || val === null || Array.isArray(val)) return;

      searchParams.append(key, val);
    });

    searchParams.sort();

    setQueryString(searchParams.toString());
  }, [router?.query]);

  return {
    serverList: data || [],
    isLoading: !error && !data,
    isError: error,
  };
}
