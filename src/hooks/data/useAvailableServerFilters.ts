import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { AvailableServerFilters } from '../../types/Types';

export default function useAvailableServerFilters() {
  const query = useQuery<AvailableServerFilters>([Endpoint.SERVER_FILTERS], { refetchOnWindowFocus: false, refetchOnMount: false });

  return query;
}
