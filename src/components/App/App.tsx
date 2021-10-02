import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import '@fontsource/inter';
import AppLayout from '../AppLayout/AppLayout';
import './app.css';
import ServersProvider from '../../contexts/ServersProvider';
import IslandsProvider from '../../contexts/IslandsProvider';
import GameProvider from '../../contexts/GameProvider';

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;
