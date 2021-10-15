import React, { useContext } from 'react';
import { ServersContext } from '../../contexts/ServersProvider';
import ServerCard from '../ServerCard/ServerCard';

const ServerList: React.FC = () => {
  const { servers } = useContext(ServersContext);

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-6">
      {servers.slice(0, 200).map((server, i) => (
        <ServerCard server={server} imageHeight={100} key={i} />
      ))}
    </div>
  );
};

export default ServerList;
