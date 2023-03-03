import { useQuery } from '@tanstack/react-query';
import { Endpoint } from '../../types/Endpoints';
import { HomeServers } from '../../types/Types';

export default function useHomeServers() {
  const query = useQuery<HomeServers>({
    queryKey: [Endpoint.HOME_SERVERS],
    refetchInterval: 120000,
  });

  return query;
}
