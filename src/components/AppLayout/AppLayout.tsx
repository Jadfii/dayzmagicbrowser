import React from 'react';
import './app-layout.scss';
import { Page, Grid, Text, useTheme } from '@geist-ui/react';
import Masthead from '../Masthead/Masthead';
import Routes from '../../routes/Routes';

const AppLayout = () => {
  const theme = useTheme();

  return (
    <>
      <div className="w-screen h-full">
        <div className="container mx-auto" style={{ background: theme.palette.background }}>
          <div className="w-full h-full">
            <Page className="flex flex-col" width="100%">
              <Page.Header>
                <Masthead />
              </Page.Header>
              <Page.Content className="relative flex-1">
                <Routes />
              </Page.Content>
              <Page.Footer style={{ position: 'initial' }}>
                <h2>Footer</h2>
              </Page.Footer>
            </Page>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
