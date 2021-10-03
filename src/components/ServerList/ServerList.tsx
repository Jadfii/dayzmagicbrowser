import React, { useContext } from 'react';
import { ServersContext } from '../../contexts/ServersProvider';
import ServerCard from '../ServerCard/ServerCard';

const ServerList: React.FC = () => {
  const { servers } = useContext(ServersContext);

  return (
    <div className="grid grid-cols-4 grid-flow-row gap-6">
      {servers.slice(0, 200).map((server, i) => (
        <ServerCard server={server} imageHeight={100} key={i} />
      ))}
    </div>
  );
};

export default ServerList;
