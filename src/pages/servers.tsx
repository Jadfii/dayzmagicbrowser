import { Button, Spacer, Text } from '@geist-ui/core';
import React from 'react';
import { GetStaticProps } from 'next';
import ServerList from '../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { useRouter } from 'next/router';
import useServers from '../hooks/data/useServers';
import { getServersPageData } from './api/servers';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Endpoint } from '../types/Endpoints';
import { getAvailableFiltersData } from './api/filters';

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery([Endpoint.SERVERS], () => getServersPageData()),
    queryClient.prefetchQuery([Endpoint.SERVER_FILTERS], () => getAvailableFiltersData()),
  ]);

  return {
    revalidate: 1800,
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Servers: React.FC = () => {
  const router = useRouter();

  const { data, isLoading } = useServers();

  function resetFilters() {
    router.push({ query: {} });
  }

  return (
    <>
      <NextSeo title="Servers" />

      <div className="relative flex flex-1 flex-col py-10">
        <div className="flex w-44 items-center justify-between">
          <Text h2>Servers</Text>
        </div>

        <div>
          <div className="flex flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center">
              <Button onClick={resetFilters} icon={<Delete />} auto>
                Reset filters
              </Button>
            </div>

            <Text p margin={0}>
              Showing {data?.servers.length ?? 0} of {data?.count ?? 0} servers
            </Text>
          </div>

          <ServerFilters />
        </div>

        <Spacer h={1} />

        <ServerList servers={data?.servers || []} isLoading={isLoading} onResetFilters={resetFilters} />
      </div>
    </>
  );
};

export default Servers;
