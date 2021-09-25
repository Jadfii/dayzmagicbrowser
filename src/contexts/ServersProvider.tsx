import React, { useEffect, useState } from 'react';
import useServersAPI from '../data/useServersAPI';
import { Server } from '../types/Types';

type ContextProps = {
  servers: Server[];
  refreshServers: () => void;
};

export const ServersContext = React.createContext<ContextProps>({
  servers: [],
  refreshServers: () => undefined,
});

const ServersProvider: React.FC = ({ children }) => {
  const { getServers } = useServersAPI();
  const [servers, setServers] = useState<Server[]>([]);

  async function refreshServers() {
    setServers(await getServers());
  }

  useEffect(() => {
    refreshServers();
  }, []);

  return (
    <ServersContext.Provider
      value={{
        servers,
        refreshServers,
      }}
    >
      {children}
    </ServersContext.Provider>
  );
};

export default ServersProvider;
