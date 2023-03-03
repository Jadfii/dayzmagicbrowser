import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Server } from '../../types/Types';

export default function useCurrentServer() {
  const router = useRouter();

  const query = useQuery<Server>({
    queryKey: [`${Endpoint.SERVERS}/${router?.query?.serverIp}/${router?.query?.serverPort}`],
    enabled: router?.isReady,
    refetchInterval: 60000,
  });

  return query;
}
