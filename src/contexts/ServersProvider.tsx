import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useServersAPI from '../data/useServersAPI';
import { Server } from '../types/Types';

const REFRESH_TIME_MINS = 5;

type ContextProps = {
  servers: Server[];
  filteredServers: Server[];
  setFilteredServers: React.Dispatch<React.SetStateAction<Server[]>>;
  refreshServers: () => void;
  isLoadingServers: boolean;
};

export const ServersContext = React.createContext<ContextProps>({} as ContextProps);

const ServersProvider: React.FC = ({ children }) => {
  const { getServers } = useServersAPI();
  const [servers, setServers] = useState<Server[]>([]);
  const [filteredServers, setFilteredServers] = useState<Server[]>([]);

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

  const refreshServers = useCallback(async () => {
    setIsLoadingServers(true);

    const serversResult = await getServers();
    const sortedServers = serversResult.sort((a, b) => b?.players + b?.queue - (a?.players + a?.queue));

    setServers(sortedServers);

    setIsLoadingServers(false);
  }, [setIsLoadingServers, setServers]);

  const exportValue = useMemo(
    () => ({ servers, filteredServers, setFilteredServers, refreshServers, isLoadingServers }),
    [servers, filteredServers, setFilteredServers, refreshServers, isLoadingServers]
  );

  return <ServersContext.Provider value={exportValue}>{children}</ServersContext.Provider>;
};

export default ServersProvider;
