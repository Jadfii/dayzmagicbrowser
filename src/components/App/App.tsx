import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import '@fontsource/inter';
import AppLayout from '../AppLayout/AppLayout';
import './app.css';
import ServersProvider from '../../contexts/ServersProvider';
import IslandsProvider from '../../contexts/IslandsProvider';
import GameProvider from '../../contexts/GameProvider';
import { TITLE_PREFIX } from '../../constants/meta.constant';

const App = () => {
  return (
    <Router>
      <HelmetProvider>
        <Helmet>
          <title>{TITLE_PREFIX}</title>
        </Helmet>

        <GeistProvider themeType={'dark'}>
          <CssBaseline />
          <IslandsProvider>
            <ServersProvider>
              <GameProvider>
                <AppLayout />
              </GameProvider>
            </ServersProvider>
          </IslandsProvider>
        </GeistProvider>
      </HelmetProvider>
    </Router>
  );
};

export default App;
