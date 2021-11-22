import React, { useEffect, useState } from 'react';
import useServersAPI from '../data/useServersAPI';
import { Server } from '../types/Types';

const REFRESH_TIME_MINS = 5;

type ContextProps = {
  servers: Server[];
  refreshServers: () => void;
  isLoadingServers: boolean;
};

export const ServersContext = React.createContext<ContextProps>({} as ContextProps);

const ServersProvider: React.FC = ({ children }) => {
  const { getServers } = useServersAPI();
  const [servers, setServers] = useState<Server[]>([]);

  const [isLoadingServers, setIsLoadingServers] = useState<boolean>(false);

  // Refresh servers after a period if they've been loaded
  useEffect(() => {
    if (servers.length === 0) return;

    const interval = setInterval(() => {
      refreshServers();
    }, REFRESH_TIME_MINS * 1000 * 60);

    return () => clearInterval(interval);
  }, [servers]);

  // Other methods below

  async function refreshServers() {
    setIsLoadingServers(true);
    const serversResult = await getServers();
    setServers(serversResult.sort((a, b) => b?.players + b?.queue - (a?.players + a?.queue)));
    setIsLoadingServers(false);
  }

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
