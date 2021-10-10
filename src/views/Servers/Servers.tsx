import { Text } from '@geist-ui/react';
import React from 'react';
import Meta from '../../components/Meta/Meta';
import ServerList from '../../components/ServerList/ServerList';

const Servers: React.FC = () => {
  return (
    <>
      <Meta title="Servers" />

      <div className="relative flex flex-col flex-1 py-10">
        <Text h2>Servers</Text>
        <ServerList />
      </div>
    </>
  );
};

export default Servers;
