import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../data/fetcher';
import { Server } from '../types/Types';

export default function useCurrentServer(initialData?: Server): {
  server: Server | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const router = useRouter();

  const { data, error } = useSWR<Server>(`/api/servers/${router?.query?.serverIp}/${router?.query?.serverPort}`, fetcher, {
    ...(initialData ? { fallbackData: initialData } : {}),
    isPaused: () => !router?.isReady,
    refreshInterval: 60000,
  });

  return {
    server: data || undefined,
    isLoading: !error && !data,
    isError: error,
  };
}
