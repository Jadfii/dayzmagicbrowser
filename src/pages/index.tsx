import { InferGetStaticPropsType } from 'next';
import prisma, { serialiseServer } from '../lib/prisma';
import { Button, Divider, Grid, Text } from '@geist-ui/react';
import BackgroundImage from '../components/BackgroundImage/BackgroundImage';
import { ArrowRight } from '@geist-ui/react-icons';
import Link from 'next/link';
import ServerCard from '../components/ServerCard/ServerCard';
import { HomeServers, Server } from '../types/Types';
import { DAYZ_EXP_APPID } from '../constants/game.constant';
import { sortServersByPlayerCount } from '../utils/server.util';
import useHomeServers from '../hooks/useHomeServers';
import ServersEmptyState from '../components/ServersEmptyState/ServersEmptyState';
import { HOME_SECTION_SERVERS_COUNT } from '../constants/layout.constant';

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
    revalidate: 60,
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

        <HomeServersSection servers={homeServersList?.popular} isLoading={isLoading} />
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

        <HomeServersSection servers={homeServersList?.official} isLoading={isLoading} />
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

        <HomeServersSection servers={homeServersList?.experimental} isLoading={isLoading} />
      </div>
    </>
  );
};

export default Home;

interface SectionProps {
  servers?: Server[];
  isLoading?: boolean;
}

const HomeServersSection: React.FC<SectionProps> = ({ servers = [], isLoading = false }) => {
  if (isLoading)
    return (
      <>
        {[...Array(HOME_SECTION_SERVERS_COUNT).keys()].map((_, i) => (
          <ServerCard imageHeight={100} key={i} />
        ))}
      </>
    );

  if (servers.length === 0)
    return (
      <>
        <ServersEmptyState dim />
      </>
    );

  return (
    <>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-flow-row gap-6">
        {servers.map((server, i) => (
          <ServerCard server={server} key={i} />
        ))}
      </div>
    </>
  );
};
