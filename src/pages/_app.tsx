import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import 'tailwindcss/tailwind.css';
import '../styles/globals.scss';
import AppLayout from '../components/AppLayout/AppLayout';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { META_DESCRIPTION, TITLE_PREFIX } from '../constants/meta.constant';
import { IMAGE_BUCKET } from '../constants/links.constant';
import { RecoilRoot } from 'recoil';

const App = ({ Component, pageProps }: AppProps) => {
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

      <RecoilRoot>
        <GeistProvider themeType={'dark'}>
          <CssBaseline />
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </GeistProvider>
      </RecoilRoot>
    </>
  );
};

export default App;
