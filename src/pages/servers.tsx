import { Button, Spacer, Text } from '@geist-ui/react';
import React from 'react';
import ServerList from '../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import prisma, { serialiseServer } from '../lib/prisma';
import { Server } from '../types/Types';
import { useRouterRefreshAtInterval } from '../hooks/useRouterRefresh';
import { useRouter } from 'next/router';
import { DAYZ_EXP_APPID } from '../constants/game.constant';
import { sortServersByPlayerCount } from '../utils/server.util';

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=120, stale-while-revalidate`);

  // Get query params
  const { name, island, version, mods, firstperson, official, experimental, noqueue } = query;

  // Get servers
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
    where: {
      ...(typeof name === 'string' ? { name: { search: name.split(' ').join(' & ') } } : {}),
      ...(typeof island === 'string' ? { island: { contains: island } } : {}),
      ...(typeof version === 'string' ? { version } : {}),
      ...(typeof mods === 'string'
        ? {
            modIds: {
              hasEvery: mods.split(',').map((modId) => Number(modId.trim())),
            },
          }
        : {}),
      ...(typeof firstperson === 'string' ? { isFirstPerson: true } : {}),
      ...(typeof official === 'string' ? { isPublicHive: true } : {}),
      ...(typeof experimental === 'string' ? { appId: DAYZ_EXP_APPID } : {}),
      ...(typeof noqueue === 'string' ? { queueCount: 0 } : {}),
    },
    include: {
      relatedIsland: true,
    },
  });

  // Serialise servers so they can be passed to component
  const serialisedServers: Server[] = sortServersByPlayerCount(servers.map(serialiseServer));

  return {
    props: {
      servers: serialisedServers,
    },
  };
};

const Servers: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ servers }) => {
  useRouterRefreshAtInterval(120000);
  const router = useRouter();

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
              Showing {servers.length} servers
            </Text>
          </div>

          <ServerFilters />
        </div>

        <Spacer h={1} />

        <ServerList servers={servers} isLoading={false} onResetFilters={resetFilters} />
      </div>
    </>
  );
};

export default Servers;
