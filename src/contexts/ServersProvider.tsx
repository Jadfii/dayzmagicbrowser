import React, { useEffect, useState } from 'react';
import useServersAPI from '../data/useServersAPI';
import { Server } from '../types/Types';

type ContextProps = {
  servers: Server[];
  refreshServers: () => void;
  isLoadingServers: boolean;
};

export const ServersContext = React.createContext<ContextProps>({
  servers: [],
  refreshServers: () => undefined,
  isLoadingServers: false,
});

const ServersProvider: React.FC = ({ children }) => {
  const { getServers } = useServersAPI();
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoadingServers, setIsLoadingServers] = useState<boolean>(false);

  async function refreshServers() {
    setIsLoadingServers(true);
    const serversResult = await getServers();
    setServers(serversResult.sort((a, b) => b.players + b.queue - (a.players + a.queue)));
    setIsLoadingServers(false);
  }

  useEffect(() => {
    refreshServers();
  }, []);

  return (
    <ServersContext.Provider
      value={{
        servers,
        refreshServers,
        isLoadingServers,
      }}
    >
      {children}
    </ServersContext.Provider>
  );
};

export default ServersProvider;
