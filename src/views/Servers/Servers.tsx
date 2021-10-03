import React from 'react';
import ServerList from '../../components/ServerList/ServerList';

const Servers: React.FC = () => {
  return (
    <div className="relative flex items-center flex-1 py-10">
      <ServerList />
    </div>
  );
};

export default Servers;
