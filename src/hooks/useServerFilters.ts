import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { SERVER_FILTER } from '../types/Types';

export default function useServerFilters() {
  const router = useRouter();
  const flatRouterQuery = useMemo(() => JSON.stringify(router?.query || {}), [router?.query]);

  const isInitialised = useRef<boolean>(false);

  // Filters
  const [name, setName] = useState<string>('');
  const [island, setIsland] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [mods, setMods] = useState<string>('');

  const ALL_FILTERS = [name, island, version, mods];

  const getFilter = useCallback(
    (filter: SERVER_FILTER) => {
      if (filter === SERVER_FILTER.NAME) return name;
      else if (filter === SERVER_FILTER.ISLAND) return island;
      else if (filter === SERVER_FILTER.VERSION) return version;
      else if (filter === SERVER_FILTER.MODS) return mods.split(',').filter((e) => e.trim().length);

      return undefined;
    },
    [...ALL_FILTERS]
  );

  const setFilter = useCallback(
    (filter: SERVER_FILTER, value: string) => {
      /*if (filter === SERVER_FILTER.NAME) setName(value);
      else if (filter === SERVER_FILTER.ISLAND) setIsland(value);
      else if (filter === SERVER_FILTER.VERSION) setVersion(value);
      else if (filter === SERVER_FILTER.MODS) setMods(value);*/

      const queryFilterParam = filter.toLowerCase();

      const prevRouterQueryParams = { ...router.query };
      if (!value && prevRouterQueryParams?.[queryFilterParam]) delete prevRouterQueryParams[queryFilterParam];

      router.push({
        query: { ...prevRouterQueryParams, ...(value ? { [queryFilterParam]: value } : {}) },
      });
    },
    [...ALL_FILTERS, router?.query]
  );

  useEffect(() => {
    if (!router?.isReady) return;

    const { name, island, version, mods } = router.query;

    if (name) setName(name as string);
    if (island) setIsland(island as string);
    if (version) setVersion(version as string);
    if (mods) setMods(mods as string);

    isInitialised.current = true;
  }, [router?.isReady, flatRouterQuery]);

  return { getFilter, setFilter };
}
