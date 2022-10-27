import { InferGetStaticPropsType } from 'next';
import prisma, { serialiseServer } from '../lib/prisma';
import { Button, Divider, Grid, Text } from '@geist-ui/core';
import BackgroundImage from '../components/BackgroundImage/BackgroundImage';
import { ArrowRight } from '@geist-ui/react-icons';
import Link from 'next/link';
import { HomeServers } from '../types/Types';
import { DAYZ_EXP_APPID } from '../constants/game.constant';
import { sortServersByPlayerCount } from '../utils/server.util';
import useHomeServers from '../hooks/useHomeServers';
import { HOME_SECTION_SERVERS_COUNT } from '../constants/layout.constant';
import HomeServersSection from '../components/HomeServers/HomeServersSection';

export const getStaticProps = async () => {
  const popularServers = prisma.server.findMany({
    take: HOME_SECTION_SERVERS_COUNT,
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    include: {
      relatedIsland: true,
    },
  });

  const officialServers = prisma.server.findMany({
    where: {
      isPublicHive: true,
    },
    take: HOME_SECTION_SERVERS_COUNT,
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    include: {
      relatedIsland: true,
    },
  });

  const experimentalServers = prisma.server.findMany({
    where: {
      appId: DAYZ_EXP_APPID,
    },
    take: HOME_SECTION_SERVERS_COUNT,
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    include: {
      relatedIsland: true,
    },
  });

  const [popular, official, experimental] = await Promise.all([popularServers, officialServers, experimentalServers]);

  const homeServers: HomeServers = {
    popular: sortServersByPlayerCount(popular.map(serialiseServer)),
    official: sortServersByPlayerCount(official.map(serialiseServer)),
    experimental: sortServersByPlayerCount(experimental.map(serialiseServer)),
  };

  return {
    revalidate: 600,
    props: {
      homeServers,
    },
  };
};

const Home: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ homeServers }) => {
  const { homeServersList, isLoading } = useHomeServers(homeServers);

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
                <Button type="success-light" iconRight={<ArrowRight />} scale={5 / 3} width="100%">
                  Browse servers
                </Button>
              </Link>
            </div>
          </Grid>
        </Grid.Container>
      </div>

      <Divider my={0} />

      <HomeServersSection
        title="Popular servers"
        description="What people are playing at the moment"
        servers={homeServersList?.popular}
        isLoading={isLoading}
      />

      <Divider />

      <HomeServersSection
        title="Official servers"
        description="The most popular official servers"
        servers={homeServersList?.official}
        isLoading={isLoading}
      />

      <Divider />

      <HomeServersSection
        title="Experimental servers"
        description="The most popular experimental branch servers"
        servers={homeServersList?.experimental}
        isLoading={isLoading}
      />
    </>
  );
};

export default Home;
