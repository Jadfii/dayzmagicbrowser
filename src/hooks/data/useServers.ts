import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { getServersPageData } from '../../pages/api/servers';
import { encode } from 'querystring';

export const SERVERS_STALE_TIME = 1800 * 1000;

type Data = Awaited<ReturnType<typeof getServersPageData>>;

export default function useServers() {
  const router = useRouter();

  const query = useQuery<Data>({
    queryKey: [`${Endpoint.SERVERS}`, ...(Object.keys(router?.query ?? {}).length > 0 ? [`${encode(router.query)}`] : [])],
    keepPreviousData: true,
    refetchInterval: 120000,
    staleTime: SERVERS_STALE_TIME,
  });

  return query;
}
