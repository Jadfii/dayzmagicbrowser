import React from 'react';
import './home.scss';
import { Button, Grid, Text } from '@geist-ui/react';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';
import { ArrowRight } from '@geist-ui/react-icons';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <div className="relative flex items-center flex-auto" style={{ height: '80vh' }}>
      <BackgroundImage src="https://dayz-magic-launcher.s3.eu-west-2.amazonaws.com/images/home.jpg" />

      <Grid.Container gap={2} className="my-auto">
        <Grid xs={2}></Grid>

        <Grid xs={10} className="relative flex-col">
          <Text h1 margin={'0 0 1rem 0'} style={{ lineHeight: '1.25' }}>
            Find your next favourite DayZ server
          </Text>

          <Text p margin={0}>
            Browse & refine a full list of DayZ servers and connect directly into the game.
            <br />
            All from your browser. No downloads required.
          </Text>

          <div className="mt-10" style={{ width: '75%' }}>
            <Button onClick={() => history.push('/servers')} type="success-light" iconRight={<ArrowRight />} scale={6 / 3} width="100%">
              Browse servers
            </Button>
          </div>
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default Home;
