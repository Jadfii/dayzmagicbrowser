import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { getServersPageData } from '../../pages/api/servers';
import { encode } from 'querystring';

type Data = Awaited<ReturnType<typeof getServersPageData>>;

export default function useServers() {
  const router = useRouter();

  const query = useQuery<Data>({
    queryKey: [`${Endpoint.SERVERS}`, ...(router?.query ? [`${encode(router.query)}`] : [])],
    enabled: router?.isReady,
    keepPreviousData: true,
    refetchInterval: 120000,
  });

  return query;
}
