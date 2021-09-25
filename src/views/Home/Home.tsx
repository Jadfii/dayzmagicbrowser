import React from 'react';
import './home.scss';
import { Grid, Text } from '@geist-ui/react';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';

const Home: React.FC = () => {
  return (
    <>
      <BackgroundImage src="https://dayz-magic-launcher.s3.eu-west-2.amazonaws.com/images/home.jpg" />

      <Grid.Container gap={2} justify="center">
        <Grid xs={24} className="flex-col">
          <Text h2>Hello, World</Text>
          <Text p>DayZ Magic Browser</Text>
        </Grid>
      </Grid.Container>
    </>
  );
};

export default Home;
