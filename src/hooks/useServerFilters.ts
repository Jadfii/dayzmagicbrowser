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
  const [firstPerson, setFirstPerson] = useState<boolean>(false);
  const [official, setOfficial] = useState<boolean>(false);
  const [experimental, setExperimental] = useState<boolean>(false);

  const ALL_FILTERS = [name, island, version, mods, firstPerson, official, experimental];

  const getFilter = useCallback(
    (filter: SERVER_FILTER) => {
      if (filter === SERVER_FILTER.NAME) return name;
      else if (filter === SERVER_FILTER.ISLAND) return island;
      else if (filter === SERVER_FILTER.VERSION) return version;
      else if (filter === SERVER_FILTER.MODS) return mods.split(',').filter((e) => e.trim().length);
      else if (filter === SERVER_FILTER.FIRST_PERSON) return firstPerson;
      else if (filter === SERVER_FILTER.OFFICIAL) return official;
      else if (filter === SERVER_FILTER.EXPERIMENTAL) return experimental;

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

    const { name, island, version, mods, firstperson, official, experimental } = router.query;

    setName((name as string) || '');
    setIsland((island as string) || '');
    setVersion((version as string) || '');
    setMods((mods as string) || '');
    setFirstPerson(Boolean(firstperson));
    setOfficial(Boolean(official));
    setExperimental(Boolean(experimental));

    isInitialised.current = true;
  }, [router?.isReady, flatRouterQuery]);

  return { getFilter, setFilter };
}
