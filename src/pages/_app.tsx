import React from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import '../styles/globals.scss';
import IslandsProvider from '../contexts/IslandsProvider';
import ServersProvider from '../contexts/ServersProvider';
import GameProvider from '../contexts/GameProvider';
import AppLayout from '../components/AppLayout/AppLayout';
import type { AppProps /*, AppContext */ } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <GeistProvider themeType={'dark'}>
        <CssBaseline />
        <IslandsProvider>
          <ServersProvider>
            <GameProvider>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </GameProvider>
          </ServersProvider>
        </IslandsProvider>
      </GeistProvider>
    </>
  );
};

export default App;
