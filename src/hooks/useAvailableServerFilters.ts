import useSWR from 'swr';
import { fetcher } from '../data/fetcher';
import { AvailableServerFilters } from '../types/Types';

export default function useAvailableServerFilters(): { availableFilters: AvailableServerFilters | undefined; isLoading: boolean; isError: boolean } {
  const { data, error, isLoading } = useSWR<AvailableServerFilters>(`/api/filters`, fetcher);

  return {
    availableFilters: data,
    isLoading: isLoading,
    isError: error,
  };
}
