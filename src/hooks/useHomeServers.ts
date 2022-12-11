import useSWR from 'swr';
import { fetcher } from '../data/fetcher';
import { HomeServers } from '../types/Types';

const EMPTY_HOME_SERVERS: HomeServers = { popular: [], official: [], experimental: [] };

export default function useHomeServers(initialData?: HomeServers): {
  homeServersList: HomeServers;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error, isLoading } = useSWR<HomeServers>('/api/servers/home', fetcher, {
    ...(initialData ? { fallbackData: initialData } : {}),
    refreshInterval: 120000,
  });

  return {
    homeServersList: data || EMPTY_HOME_SERVERS,
    isLoading: isLoading,
    isError: error,
  };
}
