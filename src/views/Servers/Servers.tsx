import { Button, Spacer, Text } from '@geist-ui/react';
import React, { useContext, useEffect } from 'react';
import ServerList from '../../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { ServerFiltersContext } from '../../contexts/ServerFiltersProvider';
import { Server } from '../../types/Types';

interface Props {
  servers: Server[];
}

const Servers: React.FC<Props> = ({ servers }) => {
  const { resetFilters, filteredServers, setFilteredServers } = useContext(ServerFiltersContext);

  useEffect(() => {
    setFilteredServers(servers);
  }, [servers]);

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

          {servers.length > 0 && <ServerFilters servers={servers} />}
        </div>

        <Spacer h={1} />

        <ServerList servers={filteredServers} />
      </div>
    </>
  );
};

export default Servers;
