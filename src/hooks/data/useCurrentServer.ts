import { Endpoint } from './../../types/Endpoints';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Server } from '../../types/Types';

export default function useCurrentServer(options?: UseQueryOptions<Server>) {
  const router = useRouter();

  const query = useQuery<Server>({
    queryKey: [`${Endpoint.SERVERS}/${router?.query?.serverIp}/${router?.query?.serverPort}`],
    enabled: router?.isReady,
    refetchInterval: 60000,
    ...options,
  });

  return query;
}
