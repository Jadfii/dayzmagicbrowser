import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import 'tailwindcss/tailwind.css';
import '../styles/globals.scss';
import IslandsProvider from '../contexts/IslandsProvider';
import GameProvider from '../contexts/GameProvider';
import AppLayout from '../components/AppLayout/AppLayout';
import type { AppProps /*, AppContext */ } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { META_DESCRIPTION, TITLE_PREFIX } from '../constants/meta.constant';
import { IMAGE_BUCKET } from '../constants/links.constant';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <DefaultSeo
        defaultTitle={TITLE_PREFIX}
        titleTemplate={`${TITLE_PREFIX} - %s`}
        description={META_DESCRIPTION}
        openGraph={{
          images: [{ url: `${IMAGE_BUCKET}home.jpg` }],
          site_name: TITLE_PREFIX,
        }}
        additionalLinkTags={[
          {
            rel: 'shortcut icon',
            href: '/assets/favicon.png',
          },
        ]}
      />

      <GeistProvider themeType={'dark'}>
        <CssBaseline />
        <IslandsProvider>
          <GameProvider>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </GameProvider>
        </IslandsProvider>
      </GeistProvider>
    </>
  );
};

export default App;
