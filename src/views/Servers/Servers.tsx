import { Button, Spacer, Text } from '@geist-ui/react';
import React, { useContext } from 'react';
import ServerList from '../../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { ServersContext } from '../../contexts/ServersProvider';
import { ServerFiltersContext } from '../../contexts/ServerFiltersProvider';

const Servers: React.FC = () => {
  const { filteredServers } = useContext(ServersContext);
  const { resetFilters } = useContext(ServerFiltersContext);

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
              Showing {filteredServers.length} servers
            </Text>
          </div>

          <ServerFilters />
        </div>

        <Spacer h={1} />

        <ServerList />
      </div>
    </>
  );
};

export default Servers;
