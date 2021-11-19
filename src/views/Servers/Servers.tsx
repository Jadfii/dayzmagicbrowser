import { Button, Spacer, Text } from '@geist-ui/react';
import React, { useContext, useEffect } from 'react';
import ServerList from '../../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { ServerFiltersContext } from '../../contexts/ServerFiltersProvider';
import { ServersContext } from 'src/contexts/ServersProvider';

const Servers: React.FC = () => {
  const { servers, isLoadingServers, refreshServers } = useContext(ServersContext);
  const { resetFilters } = useContext(ServerFiltersContext);

  useEffect(() => {
    if (!servers?.length) refreshServers();
  }, []);

  return (
    <>
      <NextSeo title="Servers" />

      <div className="relative flex flex-col flex-1 py-10">
        <Text h2>Servers</Text>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button onClick={() => resetFilters()} icon={<Delete />} auto>
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

        <ServerList servers={servers} isLoading={isLoadingServers} />
      </div>
    </>
  );
};

export default Servers;
