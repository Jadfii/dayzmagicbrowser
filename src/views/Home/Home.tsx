import React from 'react';
import { Button, Divider, Grid, Loading, Text } from '@geist-ui/react';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';
import { ArrowRight } from '@geist-ui/react-icons';
import { useRouter } from 'next/router';
import ServerCard from '../../components/ServerCard/ServerCard';
import { IMAGE_BUCKET } from '../../constants/links.constant';
import { HomeServers } from '../../types/Types';

interface Props {
  homeServers: HomeServers;
}

const Home: React.FC<Props> = ({ homeServers }) => {
  const router = useRouter();

  return (
    <>
      <div className="relative flex items-center flex-auto" style={{ height: '75vh' }}>
        <BackgroundImage src={`${IMAGE_BUCKET}home.jpg`} />

        <Grid.Container className="px-8 my-auto">
          <Grid sm={24} md={18} lg={10} className="relative flex-col">
            <Text h1 margin={'0 0 1rem 0'} style={{ lineHeight: '1.25' }}>
              Find your next favourite DayZ server
            </Text>

            <Text p margin={0}>
              Browse & refine a full list of DayZ servers and connect directly into the game.
              <br />
              All from your browser. No downloads required.
            </Text>

            <div className="mt-10" style={{ width: '75%' }}>
              <Button onClick={() => router.push('/servers')} type="success-light" iconRight={<ArrowRight />} scale={5 / 3} width="100%">
                Browse servers
              </Button>
            </div>
          </Grid>
        </Grid.Container>
      </div>

      <Divider my={0} />

      <div className="relative flex-auto py-10">
        <div>
          <Text h3 margin={0}>
            Popular servers
          </Text>
          <Text p type="secondary" className="mb-4 mt-0">
            What people are playing at the moment
          </Text>
        </div>

        {homeServers?.popular.length > 0 ? (
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-flow-row gap-6">
            {homeServers?.popular.map((server, i) => (
              <ServerCard server={server} key={i} />
            ))}
          </div>
        ) : (
          <Loading>Loading servers</Loading>
        )}
      </div>

      <Divider />

      <div className="relative flex-auto py-10">
        <div>
          <Text h3 margin={0}>
            Official servers
          </Text>
          <Text p type="secondary" className="mb-4 mt-0">
            The most popular official servers
          </Text>
        </div>

        {homeServers?.official.length > 0 ? (
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-flow-row gap-6">
            {homeServers?.official.map((server, i) => (
              <ServerCard server={server} key={i} />
            ))}
          </div>
        ) : (
          <Loading>Loading servers</Loading>
        )}
      </div>

      <Divider />

      <div className="relative flex-auto py-10">
        <div>
          <Text h3 margin={0}>
            Experimental servers
          </Text>
          <Text p type="secondary" className="mb-4 mt-0">
            The most popular experimental branch servers
          </Text>
        </div>

        {homeServers?.experimental.length > 0 ? (
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-flow-row gap-6">
            {homeServers?.experimental.map((server, i) => (
              <ServerCard server={server} key={i} />
            ))}
          </div>
        ) : (
          <Loading>Loading servers</Loading>
        )}
      </div>
    </>
  );
};

export default Home;
