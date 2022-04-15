import { Button, Spacer, Text } from '@geist-ui/react';
import React from 'react';
import ServerList from '../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { InferGetStaticPropsType } from 'next';
import prisma, { serialiseServer } from '../lib/prisma';
import { Server } from '../types/Types';
import { useRouterRefreshAtInterval } from '../hooks/useRouterRefresh';

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
    take: 200,
  });

  const serialisedServers: Server[] = servers.map(serialiseServer);

  return {
    revalidate: 60,
    props: { servers: serialisedServers },
  };
};

const Servers: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ servers }) => {
  useRouterRefreshAtInterval(120000);

  return (
    <>
      <NextSeo title="Servers" />

      <div className="relative flex flex-col flex-1 py-10">
        <Text h2>Servers</Text>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button onClick={() => console.log('reset filters')} icon={<Delete />} auto>
                Reset filters
              </Button>
            </div>

            <Text p margin={0}>
              Showing {servers.length} servers
            </Text>
          </div>

          <ServerFilters servers={servers} />
        </div>

        <Spacer h={1} />

        <ServerList servers={servers} isLoading={false} />
      </div>
    </>
  );
};

export default Servers;
