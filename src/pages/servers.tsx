import { Button, Spacer, Text } from '@geist-ui/core';
import React from 'react';
import { GetServerSideProps } from 'next';
import ServerList from '../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { useRouter } from 'next/router';
import useServers from '../hooks/data/useServers';
import { getServersPageData } from './api/servers';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Endpoint } from '../types/Endpoints';
import { encode } from 'querystring';

export const getServerSideProps: GetServerSideProps = async ({ res, query }) => {
  const encodedQuery = encode(query);

  const queryClient = new QueryClient();
  await Promise.all([queryClient.prefetchQuery([Endpoint.SERVERS, ...(encodedQuery && [`${encodedQuery}`])], () => getServersPageData(query))]);

  // Caching
  res.setHeader('Cache-Control', `s-maxage=60, stale-while-revalidate`);

  return {
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
          <div className="flex items-center justify-between">
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
