import { Button, Spacer, Text } from '@geist-ui/react';
import React, { useContext, useState } from 'react';
import ServerList from '../../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../../components/ServerFilters/ServerFilters';
import { Filter } from '@geist-ui/react-icons';
import { ServersContext } from '../../contexts/ServersProvider';

const Servers: React.FC = () => {
  const { filteredServers } = useContext(ServersContext);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  return (
    <>
      <NextSeo title="Servers" />

      <div className="relative flex flex-col flex-1 py-10">
        <Text h2>Servers</Text>

        <div>
          <div className="flex items-center justify-between">
            <Button onClick={() => setIsFiltering((state) => !state)} icon={<Filter />} auto>
              Filters
            </Button>

            <Text p margin={0}>
              Showing {filteredServers.length} servers
            </Text>
          </div>

          <ServerFilters visible={isFiltering} />
        </div>

        <Spacer h={1} />

        <ServerList />
      </div>
    </>
  );
};

export default Servers;
