import React, { Dispatch, useEffect, useState } from 'react';
import useServersAPI from '../data/useServersAPI';
import useDebounce from '../hooks/useDebounce';
import { Server, ServerFilters } from '../types/Types';

type ContextProps = {
  filteredServers: Server[];
  setFilteredServers: Dispatch<React.SetStateAction<Server[]>>;
  resetFilters: () => void;
  filtersActive: number;
  serverName: string;
  setServerName: Dispatch<React.SetStateAction<string>>;
  serverIsland: string;
  setServerIsland: Dispatch<React.SetStateAction<string>>;
  serverVersion: string;
  setServerVersion: Dispatch<React.SetStateAction<string>>;
  serverMods: string[];
  setServerMods: Dispatch<React.SetStateAction<string[]>>;
  isFirstPersonOnly: boolean | undefined;
  setIsFirstPersonOnly: Dispatch<React.SetStateAction<boolean | undefined>>;
  isOfficial: boolean | undefined;
  setIsOfficial: Dispatch<React.SetStateAction<boolean | undefined>>;
  isExperimental: boolean | undefined;
  setIsExperimental: Dispatch<React.SetStateAction<boolean | undefined>>;
  hasNoQueue: boolean | undefined;
  setHasNoQueue: Dispatch<React.SetStateAction<boolean | undefined>>;
};

export const ServerFiltersContext = React.createContext<ContextProps>({} as ContextProps);

const ServerFiltersProvider: React.FC = ({ children }) => {
  const { getServers } = useServersAPI();

  const [filteredServers, setFilteredServers] = useState<Server[]>([]);

  const [filtersActive, setFiltersActive] = useState<number>(0);
  const [serverName, setServerName] = useState<string>('');
  const debouncedServerName = useDebounce(serverName, 500);
  const [serverIsland, setServerIsland] = useState<string>('');
  const [serverVersion, setServerVersion] = useState<string>('');
  const [isFirstPersonOnly, setIsFirstPersonOnly] = useState<boolean | undefined>(undefined);
  const [isOfficial, setIsOfficial] = useState<boolean | undefined>(undefined);
  const [isExperimental, setIsExperimental] = useState<boolean | undefined>(undefined);
  const [hasNoQueue, setHasNoQueue] = useState<boolean | undefined>(undefined);
  const [serverMods, setServerMods] = useState<string[]>([]);

  function resetFilters() {
    setServerName('');
    setServerIsland('');
    setServerVersion('');
    setIsFirstPersonOnly(false);
    setIsOfficial(false);
    setIsExperimental(false);
    setHasNoQueue(false);
    setServerMods([]);
  }

  useEffect(() => {
    (async () => {
      const filter: ServerFilters = {};

      let activeFiltersCount = 0;
      if (debouncedServerName.length > 0) {
        filter.name = debouncedServerName;
        activeFiltersCount++;
      }

      if (serverIsland.length > 0) {
        filter.map = serverIsland;
        activeFiltersCount++;
      }

      if (serverVersion.length > 0) {
        filter.version = serverVersion;
        activeFiltersCount++;
      }

      if (serverMods.length > 0) {
        activeFiltersCount++;
      }

      if (serverMods.length > 0) {
        activeFiltersCount++;
      }

      if (typeof isFirstPersonOnly !== 'undefined') {
        activeFiltersCount++;
      }

      if (typeof isOfficial !== 'undefined') {
        activeFiltersCount++;
      }

      if (typeof isExperimental !== 'undefined') {
        activeFiltersCount++;
      }

      if (typeof hasNoQueue !== 'undefined') {
        activeFiltersCount++;
      }

      if (activeFiltersCount > 0 || filtersActive > 0) {
        const servers = await getServers(filter);
        setFilteredServers(servers);
      }

      setFiltersActive(activeFiltersCount);
    })();
  }, [debouncedServerName, serverIsland, serverVersion, serverMods, isFirstPersonOnly, isOfficial, isExperimental, hasNoQueue]);

  return (
    <ServerFiltersContext.Provider
      value={{
        filteredServers,
        setFilteredServers,
        resetFilters,
        filtersActive,
        serverName,
        setServerName,
        serverIsland,
        setServerIsland,
        serverVersion,
        setServerVersion,
        serverMods,
        setServerMods,
        isFirstPersonOnly,
        setIsFirstPersonOnly,
        isOfficial,
        setIsOfficial,
        isExperimental,
        setIsExperimental,
        hasNoQueue,
        setHasNoQueue,
      }}
    >
      {children}
    </ServerFiltersContext.Provider>
  );
};

export default ServerFiltersProvider;
