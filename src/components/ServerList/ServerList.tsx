import { Text } from '@geist-ui/react';
import { Frown } from '@geist-ui/react-icons';
import React from 'react';
import { Server } from '../../types/Types';
import ServerCard from '../ServerCard/ServerCard';

const MAX_SERVERS = 250;

interface Props {
  servers: Server[];
  isLoading: boolean;
}

const ServerList: React.FC<Props> = ({ servers, isLoading }) => {
  if (servers.length === 0)
    return (
      <div className="flex flex-col items-center justify-center mt-24">
        <Frown size={48} />
        <Text h2 my={0}>
          No servers found
        </Text>
        <Text p my={0}>
          Try adjusting your filter options to find servers.
        </Text>
      </div>
    );

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-6">
      {!isLoading
        ? servers.slice(0, MAX_SERVERS).map((server, i) => <ServerCard server={server} imageHeight={100} key={i} />)
        : [...Array(MAX_SERVERS).keys()].map((_, i) => <ServerCard imageHeight={100} key={i} />)}
    </div>
  );
};

export default ServerList;
