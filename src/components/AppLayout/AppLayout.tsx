import React from 'react';
import { Page, Grid, Text, useTheme } from '@geist-ui/react';
import Masthead from '../Masthead/Masthead';

const AppLayout = () => {
  const theme = useTheme();

  return (
    <>
      <div className="w-screen h-screen" style={{ background: theme.palette.accents_1 }}>
        <div className="container mx-auto">
          <Page style={{ width: '100%', background: theme.palette.background }}>
            <Page.Header>
              <Masthead />
            </Page.Header>
            <Page.Content>
              <Grid.Container gap={2} justify="center">
                <Grid xs={24} className="flex-col">
                  <Text h2>Hello, World</Text>
                  <Text p>DayZ Magic Browser</Text>
                </Grid>
              </Grid.Container>
            </Page.Content>
            <Page.Footer>
              <h2>Footer</h2>
            </Page.Footer>
          </Page>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
