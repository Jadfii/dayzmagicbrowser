import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Button, Divider, Grid, Text } from '@geist-ui/core';
import BackgroundImage from '../components/BackgroundImage/BackgroundImage';
import { ArrowRight } from '@geist-ui/react-icons';
import Link from 'next/link';
import useHomeServers from '../hooks/data/useHomeServers';
import HomeServersSection from '../components/HomeServers/HomeServersSection';
import { getHomePageData } from './api/servers/home';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Endpoint } from '../types/Endpoints';

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([Endpoint.HOME_SERVERS], getHomePageData);

  return {
    revalidate: 1800,
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Home: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = () => {
  const { data: homeServersList, isLoading } = useHomeServers();

  return (
    <>
      <div className="relative flex flex-auto items-center" style={{ height: '75vh' }}>
        <BackgroundImage src={`/images/home.jpg`} />

        <Grid.Container className="my-auto px-0 md:px-8">
          <Grid sm={24} md={18} lg={10} className="relative flex-col">
            <Text h1 margin={'0 0 1rem 0'} className="leading-[1.25]">
              Find your next favourite DayZ server
            </Text>

            <Text p margin={0}>
              Browse & refine a full list of DayZ servers and connect directly into the game.
              <br />
              All from your browser. No downloads required.
            </Text>

            <div className="relative mt-10">
              <Link href="/servers">
                <Button type="success-light" iconRight={<ArrowRight />} scale={5 / 3} className="w-[60%]">
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
