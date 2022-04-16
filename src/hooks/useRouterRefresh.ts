import { useInterval } from 'use-interval';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
//import { unstable_useRefreshRoot as useRefreshRoot } from 'next/streaming';

export default function useRouterRefresh() {
  const { asPath, replace } = useRouter();

  return useCallback(() => replace(asPath), [asPath]);
}

export function useRouterRefreshAtInterval(interval: number, immediate?: boolean) {
  //const refresh = useRefreshRoot();
  const refresh = useRouterRefresh();

  useInterval(
    () => {
      refresh();
    },
    interval,
    immediate
  );
}
