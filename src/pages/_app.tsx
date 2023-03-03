import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import 'tailwindcss/tailwind.css';
import '../styles/globals.scss';
import AppLayout from '../components/AppLayout/AppLayout';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { META_DESCRIPTION, TITLE_PREFIX } from '../constants/meta.constant';
import { IMAGE_BUCKET } from '../constants/links.constant';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { fetcher } from '../data/fetcher';

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryFn: async (ctx) => {
              return await fetcher(`${ctx.queryKey.join('?')}`, { signal: ctx.signal });
            },
            staleTime: 1000 * 60, // 1 minute
            retry: false,
          },
        },
      })
  );

  return (
    <>
      <DefaultSeo
        defaultTitle={TITLE_PREFIX}
        titleTemplate={`${TITLE_PREFIX} - %s`}
        description={META_DESCRIPTION}
        openGraph={{
          images: [{ url: `${IMAGE_BUCKET}home.jpg` }],
          // eslint-disable-next-line camelcase
          site_name: TITLE_PREFIX,
        }}
        additionalLinkTags={[
          {
            rel: 'shortcut icon',
            href: '/assets/favicon.png',
          },
        ]}
      />

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <GeistProvider themeType={'dark'}>
            <CssBaseline />
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </GeistProvider>

          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </>
  );
};

export default App;
