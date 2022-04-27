import { Button, Spacer, Text } from '@geist-ui/react';
import React from 'react';
import { InferGetStaticPropsType } from 'next';
import ServerList from '../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { useRouter } from 'next/router';
import useServers from '../hooks/useServers';
import useServerFilters from '../hooks/useServerFilters';
import { Server } from '../types/Types';
import prisma, { serialiseServer } from '../lib/prisma';
import { sortServersByPlayerCount } from '../utils/server.util';

export const getStaticProps = async () => {
  const servers = await prisma.server.findMany({
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    take: 250,
    include: {
      relatedIsland: true,
    },
  });

  const serialisedServers: Server[] = sortServersByPlayerCount(servers.map(serialiseServer));

  return {
    revalidate: 600,
    props: {
      servers: serialisedServers,
    },
  };
};

const Servers: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ servers }) => {
  const router = useRouter();

  const filters = useServerFilters();
  const { serverList, isLoading } = useServers(servers);

  function resetFilters() {
    router.push({ query: {} });
  }

  return (
    <>
      <NextSeo title="Servers" />

      <div className="relative flex flex-col flex-1 py-10">
        <Text h2>Servers</Text>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button onClick={resetFilters} icon={<Delete />} auto>
                Reset filters
              </Button>
            </div>

            <Text p margin={0}>
              Showing {serverList.length} servers
            </Text>
          </div>

          <ServerFilters filters={filters} />
        </div>

        <Spacer h={1} />

        <ServerList servers={serverList} isLoading={isLoading} onResetFilters={resetFilters} />
      </div>
    </>
  );
};

export default Servers;
