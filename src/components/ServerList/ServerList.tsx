import React from 'react';
import { Server } from '../../types/Types';
import ServerCard from '../ServerCard/ServerCard';

const MAX_SERVERS = 200;

interface Props {
  servers: Server[];
  isLoading: boolean;
}

const ServerList: React.FC<Props> = ({ servers, isLoading }) => {
  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-6">
      {!isLoading
        ? servers.slice(0, MAX_SERVERS).map((server, i) => <ServerCard server={server} imageHeight={100} key={i} />)
        : [...Array(MAX_SERVERS).keys()].map((_, i) => <ServerCard imageHeight={100} key={i} />)}
    </div>
  );
};

export default ServerList;
