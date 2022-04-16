import { Button, Spacer, Text } from '@geist-ui/react';
import React from 'react';
import ServerList from '../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import prisma, { serialiseServer } from '../lib/prisma';
import { SelectOption, Server } from '../types/Types';
import { useRouterRefreshAtInterval } from '../hooks/useRouterRefresh';
import { findIsland } from '../state/islands';
import { getGameVersion, isMatchingVersion } from '../data/Version';

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=120, stale-while-revalidate`);

  // Get query params
  const { name, island, version, modIds } = query;

  // Construct filters for prisma where query
  const filters = {
    ...(typeof name === 'string' ? { name: { search: name.split(' ').join(' & ') } } : {}),
    ...(typeof island === 'string' ? { island: { contains: island } } : {}),
    ...(typeof version === 'string' ? { version } : {}),
    ...(typeof modIds === 'string'
      ? {
          modIds: {
            hasEvery: modIds.split(',').map((modId) => Number(modId.trim())),
          },
        }
      : {}),
  };

  // Get servers
  const serversQuery = prisma.server.findMany({
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    take: 200,
    where: filters,
  });

  // Get all islands
  const islandsQuery = prisma.island.findMany();

  // Get all available islands
  const groupedIslandsQuery = prisma.server.groupBy({
    by: ['island'],
    _count: {
      island: true,
    },
    orderBy: {
      _count: {
        island: 'desc',
      },
    },
  });

  // Get all available versions
  const groupedVersionsQuery = prisma.server.groupBy({
    by: ['version'],
    _count: {
      version: true,
    },
    orderBy: {
      version: 'desc',
    },
  });

  // Run queries
  const [servers, islands, groupedIslands, groupedVersions, gameVersion] = await Promise.all([
    serversQuery,
    islandsQuery,
    groupedIslandsQuery,
    groupedVersionsQuery,
    getGameVersion(),
  ]);

  // Serialise servers so they can be passed to component
  const serialisedServers: Server[] = servers.map(serialiseServer);

  // Match islands to saved islands in DB
  // then map to correct format
  const mappedGroupedIslands = groupedIslands.reduce<SelectOption[]>((acc, curr) => {
    const foundIsland = findIsland(curr.island, islands);
    const terrainId = foundIsland?.terrainId || curr?.island;
    const foundIdx = acc.findIndex((filter) => filter?.value === terrainId);

    if (foundIdx === -1) {
      acc.push({ label: foundIsland?.name || curr?.island, value: terrainId, count: curr?._count?.island });
    }

    return acc;
  }, []);

  // Map versions to correct format
  const mappedGroupedVersions = groupedVersions.reduce<SelectOption[]>((acc, curr) => {
    const isLatestStableVersion = isMatchingVersion(curr.version, gameVersion.stable);
    const isLatestExpVersion = !isLatestStableVersion && isMatchingVersion(curr.version, gameVersion.exp);

    acc.push({
      label: curr?.version,
      value: curr?.version,
      count: curr?._count?.version,
      highlighted: isLatestStableVersion,
      highlightedSecondary: isLatestExpVersion,
    });

    return acc;
  }, []);

  return {
    props: {
      servers: serialisedServers,
      availableFilters: {
        islands: mappedGroupedIslands,
        versions: mappedGroupedVersions,
      },
    },
  };
};

const Servers: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ servers, availableFilters }) => {
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

          <ServerFilters availableFilters={availableFilters} />
        </div>

        <Spacer h={1} />

        <ServerList servers={servers} isLoading={false} />
      </div>
    </>
  );
};

export default Servers;
