import React from 'react';
import './home.scss';
import { Grid, Text } from '@geist-ui/react';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';

const Home: React.FC = () => {
  return (
    <div className="relative flex items-center flex-1">
      <BackgroundImage src="https://dayz-magic-launcher.s3.eu-west-2.amazonaws.com/images/home.jpg" />

      <Grid.Container gap={2} className="my-auto">
        <Grid xs={2}></Grid>

        <Grid xs={10} className="flex-col">
          <Text h1 margin={'0 0 1rem 0'} style={{ lineHeight: '1.4' }}>
            Find your next favourite DayZ server
          </Text>
          <Text p margin={0}>
            Browse & refine a full list of DayZ servers and connect directly into the game.
            <br />
            All from your browser.
          </Text>
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default Home;
