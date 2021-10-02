import React, { useCallback, useEffect, useState } from 'react';
import useServersAPI from '../data/useServersAPI';
import { Server } from '../types/Types';

type ContextProps = {
  servers: Server[];
  refreshServers: () => void;
  isLoadingServers: boolean;
  findServerByIpPort: (ip: string, port: number, allowGamePort?: boolean) => Server | undefined;
};

export const ServersContext = React.createContext<ContextProps>({
  servers: [],
  refreshServers: () => undefined,
  isLoadingServers: false,
  findServerByIpPort: (ip: string, port: number, allowGamePort?: boolean) => undefined,
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

  const findServerByIpPort = useCallback(
    (ip: string, port: number, allowGamePort?: boolean) =>
      servers.find((server) => server.ip === ip && (server.queryPort === port || (allowGamePort && server.gamePort === port))),
    [servers]
  );

  return (
    <ServersContext.Provider
      value={{
        servers,
        refreshServers,
        isLoadingServers,
        findServerByIpPort,
      }}
    >
      {children}
    </ServersContext.Provider>
  );
};

export default ServersProvider;
