import useSWR from 'swr';
import http from '../services/HTTP';
import { AvailableServerFilters } from '../types/Types';

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  return await http(input, init).then((res) => res.json());
}

export default function useAvailableServerFilters(): { availableFilters: AvailableServerFilters | undefined; isLoading: boolean; isError: boolean } {
  const { data, error } = useSWR<AvailableServerFilters>(`/api/filters`, fetcher);

  return {
    availableFilters: data,
    isLoading: !error && !data,
    isError: error,
  };
}
