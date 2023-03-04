import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { Server } from '../../types/Types';

export default function useSearchServers(searchTerm: string) {
  const query = useQuery<Server[]>({
    queryKey: [`${Endpoint.SERVERS_SEARCH}?name=${encodeURI(searchTerm)}`],
    enabled: searchTerm.length > 0,
  });

  return query;
}
