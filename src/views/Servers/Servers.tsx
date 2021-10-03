import { Text } from '@geist-ui/react';
import React from 'react';
import ServerList from '../../components/ServerList/ServerList';

const Servers: React.FC = () => {
  return (
    <div className="relative flex flex-col flex-1 py-10">
      <Text h2>Servers</Text>
      <ServerList />
    </div>
  );
};

export default Servers;
