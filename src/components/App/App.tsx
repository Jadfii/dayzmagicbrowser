import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import '@fontsource/inter';
import AppLayout from '../AppLayout/AppLayout';
import './app.css';
import ServersProvider from '../../contexts/ServersProvider';

const App = () => {
  return (
    <Router>
      <GeistProvider themeType={'dark'}>
        <CssBaseline />
        <ServersProvider>
          <AppLayout />
        </ServersProvider>
      </GeistProvider>
    </Router>
  );
};

export default App;
