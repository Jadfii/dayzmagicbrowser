import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { AvailableServerFilters } from '../../types/Types';
import { SERVERS_STALE_TIME } from './useServers';

export default function useAvailableServerFilters() {
  const query = useQuery<AvailableServerFilters>({
    queryKey: [Endpoint.SERVER_FILTERS],
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: SERVERS_STALE_TIME,
  });

  return query;
}
