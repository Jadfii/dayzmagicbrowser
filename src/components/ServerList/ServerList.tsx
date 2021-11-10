import React from 'react';
import { Server } from '../../types/Types';
import ServerCard from '../ServerCard/ServerCard';

interface Props {
  servers: Server[];
}

const ServerList: React.FC<Props> = ({ servers }) => {
  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-6">
      {servers.slice(0, 200).map((server, i) => (
        <ServerCard server={server} imageHeight={100} key={i} />
      ))}
    </div>
  );
};

export default ServerList;
