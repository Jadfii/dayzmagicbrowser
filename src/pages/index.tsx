import { GetServerSideProps } from 'next';
import prisma, { serialiseServer } from '../lib/prisma';
import { Button, Divider, Grid, Loading, Text } from '@geist-ui/react';
import BackgroundImage from '../components/BackgroundImage/BackgroundImage';
import { ArrowRight } from '@geist-ui/react-icons';
import Link from 'next/link';
import ServerCard from '../components/ServerCard/ServerCard';
import { HomeServers, Server } from '../types/Types';
import { DAYZ_EXP_APPID } from '../constants/game.constant';
import { useRouterRefreshAtInterval } from '../hooks/useRouterRefresh';

export const getServerSideProps: GetServerSideProps = async () => {
  const popularServers = await prisma.server.findMany({
    take: 4,
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
  });

  const officialServers = await prisma.server.findMany({
    where: {
      isPublicHive: true,
    },
    take: 4,
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
  });

  const experimentalServers = await prisma.server.findMany({
    where: {
      appId: DAYZ_EXP_APPID,
    },
    take: 4,
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
  });

  return {
    props: {
      homeServers: Object.fromEntries(
        Object.entries({ popular: popularServers, official: officialServers, experimental: experimentalServers }).map(([key, val]) => [
          key,
          val.map(serialiseServer),
        ])
      ),
    },
  };
};

interface Props {
  homeServers: HomeServers;
}

const Home: React.FC<Props> = ({ homeServers }) => {
  useRouterRefreshAtInterval(120000);

  return (
    <>
      <div className="relative flex items-center flex-auto" style={{ height: '75vh' }}>
        <BackgroundImage src={`/images/home.jpg`} />

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
              <Link href="/servers">
                <a>
                  <Button type="success-light" iconRight={<ArrowRight />} scale={5 / 3} width="100%">
                    Browse servers
                  </Button>
                </a>
              </Link>
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
