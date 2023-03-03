import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServersPageData } from '../../pages/api/servers';

type Data = Awaited<ReturnType<typeof getServersPageData>>;

export default function useServers() {
  const router = useRouter();
  const [filters, setFilters] = useState<string>('');

  const query = useQuery<Data>({
    queryKey: [`${Endpoint.SERVERS}`, ...(filters && [`${filters}`])],
    enabled: router?.isReady,
    keepPreviousData: true,
    refetchOnMount: false,
    refetchInterval: 120000,
  });

  useEffect(() => {
    if (!router?.isReady || !router?.query) return;

    const searchParams = new URLSearchParams();

    Object.entries(router.query).forEach(([key, val]) => {
      if (typeof val === 'undefined' || val === null || Array.isArray(val)) return;

      searchParams.append(key, val);
    });

    searchParams.sort();

    setFilters(searchParams.toString());
  }, [router?.query]);

  return query;
}
