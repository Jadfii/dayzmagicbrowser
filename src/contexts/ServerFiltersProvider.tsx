import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { DAYZ_EXP_APPID } from '../constants/game.constant';
import { IslandsContext } from './IslandsProvider';
import { ServersContext } from './ServersProvider';

type ContextProps = {
  resetFilters: () => void;
  filtersActive: number;
  serverName: string;
  setServerName: React.Dispatch<React.SetStateAction<string>>;
  serverIsland: string;
  setServerIsland: React.Dispatch<React.SetStateAction<string>>;
  serverVersion: string;
  setServerVersion: React.Dispatch<React.SetStateAction<string>>;
  serverMods: string[];
  setServerMods: React.Dispatch<React.SetStateAction<string[]>>;
  isFirstPersonOnly: boolean | undefined;
  setIsFirstPersonOnly: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isOfficial: boolean | undefined;
  setIsOfficial: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isExperimental: boolean | undefined;
  setIsExperimental: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  hasNoQueue: boolean | undefined;
  setHasNoQueue: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

export const ServerFiltersContext = React.createContext<ContextProps>({} as ContextProps);

const ServerFiltersProvider: React.FC = ({ children }) => {
  const { getIslandByTerrain } = useContext(IslandsContext);
  const { servers, setFilteredServers } = useContext(ServersContext);

  const [filtersActive, setFiltersActive] = useState<number>(0);
  const [serverName, setServerName] = useState<string>('');
  const [serverIsland, setServerIsland] = useState<string>('');
  const [serverVersion, setServerVersion] = useState<string>('');
  const [isFirstPersonOnly, setIsFirstPersonOnly] = useState<boolean | undefined>(undefined);
  const [isOfficial, setIsOfficial] = useState<boolean | undefined>(undefined);
  const [isExperimental, setIsExperimental] = useState<boolean | undefined>(undefined);
  const [hasNoQueue, setHasNoQueue] = useState<boolean | undefined>(undefined);
  const [serverMods, setServerMods] = useState<string[]>([]);

  const resetFilters = useCallback(() => {
    setServerName('');
    setServerIsland('');
    setServerVersion('');
    setIsFirstPersonOnly(false);
    setIsOfficial(false);
    setIsExperimental(false);
    setHasNoQueue(false);
    setServerMods([]);
  }, [setServerName, setServerIsland, setServerVersion, setIsFirstPersonOnly, setIsOfficial, setIsExperimental, setHasNoQueue, setServerMods]);

  useEffect(() => {
    (async () => {
      let serversToFilter = [...servers];

      let activeFiltersCount = 0;
      if (serverName.length > 0) {
        activeFiltersCount++;
        serversToFilter = serversToFilter.filter((server) => server?.name?.toLowerCase().includes(serverName?.toLowerCase()));
      }

      if (serverIsland.length > 0) {
        activeFiltersCount++;
        serversToFilter = serversToFilter.filter((server) => (getIslandByTerrain(server?.island)?.terrainId || server?.island) === serverIsland);
      }

      if (serverVersion.length > 0) {
        activeFiltersCount++;
        serversToFilter = serversToFilter.filter((server) => server?.version === serverVersion);
      }

      if (serverMods.length > 0) {
        activeFiltersCount++;
      }

      if (isFirstPersonOnly) {
        activeFiltersCount++;
        serversToFilter = serversToFilter.filter((server) => server?.isFirstPerson);
      }

      if (isOfficial) {
        activeFiltersCount++;
        serversToFilter = serversToFilter.filter((server) => server?.isPublicHive);
      }

      if (isExperimental) {
        activeFiltersCount++;
        serversToFilter = serversToFilter.filter((server) => server?.appId === DAYZ_EXP_APPID);
      }

      if (hasNoQueue) {
        activeFiltersCount++;
        serversToFilter = serversToFilter.filter((server) => server?.queue <= 0);
      }

      setFiltersActive(activeFiltersCount);
      setFilteredServers(serversToFilter);
    })();
  }, [servers, serverName, serverIsland, serverVersion, serverMods, isFirstPersonOnly, isOfficial, isExperimental, hasNoQueue]);

  const exportValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return <ServerFiltersContext.Provider value={exportValue}>{children}</ServerFiltersContext.Provider>;
};

export default ServerFiltersProvider;
