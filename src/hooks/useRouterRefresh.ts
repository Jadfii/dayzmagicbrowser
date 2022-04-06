import { useInterval } from 'use-interval';
import { useCallback } from 'react';
import { useRouter } from 'next/router';

export default function useRouterRefresh() {
  const { asPath, replace } = useRouter();

  return useCallback(() => replace(asPath), [asPath]);
}

export function useRouterRefreshAtInterval(interval: number, immediate?: boolean) {
  const refresh = useRouterRefresh();

  useInterval(
    () => {
      refresh();
    },
    interval,
    immediate
  );
}
