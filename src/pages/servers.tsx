import { Button, Spacer, Text } from '@geist-ui/react';
import React from 'react';
import ServerList from '../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { GetServerSideProps } from 'next';
import prisma, { serialiseServer } from '../lib/prisma';
import { Server } from '../types/Types';
import { useRouterRefreshAtInterval } from '../hooks/useRouterRefresh';

export const getServerSideProps: GetServerSideProps = async () => {
  const servers = await prisma.server.findMany();

  const serialisedServers: Server[] = servers.map(serialiseServer);

  return {
    props: { servers: serialisedServers },
  };
};

interface Props {
  servers: Server[];
}

const Servers: React.FC<Props> = ({ servers }) => {
  useRouterRefreshAtInterval(120000);

  return (
    <>
      <NextSeo title="Servers" />

      <div className="relative flex flex-col flex-1 py-10">
        <Text h2>Servers</Text>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button onClick={() => {}} icon={<Delete />} auto>
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
