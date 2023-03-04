import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { AvailableServerFilters } from '../../types/Types';

export default function useAvailableServerFilters() {
  const query = useQuery<AvailableServerFilters>({
    queryKey: [Endpoint.SERVER_FILTERS],
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}