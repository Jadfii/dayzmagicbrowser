import { Button, Spacer, Text } from '@geist-ui/react';
import React, { useState } from 'react';
import ServerList from '../../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../../components/ServerFilters/ServerFilters';
import { Filter } from '@geist-ui/react-icons';

const Servers: React.FC = () => {
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  return (
    <>
      <NextSeo title="Servers" />

      <div className="relative flex flex-col flex-1 py-10">
        <Text h2>Servers</Text>

        <div>
          <Button onClick={() => setIsFiltering((state) => !state)} icon={<Filter />} auto>
            Filters
          </Button>

          <ServerFilters visible={isFiltering} handleClose={() => setIsFiltering(false)} />
        </div>

        <Spacer h={1} />

        <ServerList />
      </div>
    </>
  );
};

export default Servers;
