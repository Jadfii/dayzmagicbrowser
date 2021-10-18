import React, { Dispatch, useContext, useEffect, useState } from 'react';
import { useWorker, WORKER_STATUS } from '@koale/useworker';
import { Server } from '../types/Types';
import { DAYZ_EXP_APPID } from '../constants/game.constant';
import { ServersContext } from './ServersProvider';
import useDebounce from '../hooks/useDebounce';

const filterServers = (
  servers: Server[],
  expAppId: number,
  serverName: string,
  serverIsland: string,
  serverVersion: string,
  serverMods: string[],
  isFirstPersonOnly: boolean,
  isOfficial: boolean,
  isExperimental: boolean,
  hasNoQueue: boolean
) => {
  let filtersActive = 0;
  return {
    servers: servers.filter((server) => {
      let shouldInclude = true;
      const setShouldInclude = (include: boolean) => {
        shouldInclude = shouldInclude && include;
      };

      if (serverName) {
        setShouldInclude(server?.name?.toLowerCase().includes(serverName.toLowerCase()));
        filtersActive++;
      }

      if (serverIsland) {
        setShouldInclude(server?.island?.toLowerCase().includes(serverIsland.toLowerCase()));
        filtersActive++;
      }

      if (serverVersion) {
        setShouldInclude(server?.version === serverVersion);
        filtersActive++;
      }

      if (serverMods.length > 0) {
        setShouldInclude(serverMods.every((mod) => server?.mods.find((m) => mod === m.steamId)));
        filtersActive++;
      }

      if (isFirstPersonOnly === true) {
        setShouldInclude(server?.isFirstPerson === isFirstPersonOnly);
        filtersActive++;
      }

      if (isOfficial === true) {
        setShouldInclude(server?.isPublicHive === isOfficial);
        filtersActive++;
      }

      if (isExperimental === true) {
        setShouldInclude(server?.appId === expAppId);
        filtersActive++;
      }

      if (hasNoQueue === true) {
        setShouldInclude(server?.queue === 0);
        filtersActive++;
      }

      return shouldInclude;
    }),
    filtersActive,
  };
};

type ContextProps = {
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
  isFirstPersonOnly: boolean;
  setIsFirstPersonOnly: Dispatch<React.SetStateAction<boolean>>;
  isOfficial: boolean;
  setIsOfficial: Dispatch<React.SetStateAction<boolean>>;
  isExperimental: boolean;
  setIsExperimental: Dispatch<React.SetStateAction<boolean>>;
  hasNoQueue: boolean;
  setHasNoQueue: Dispatch<React.SetStateAction<boolean>>;
};

export const ServerFiltersContext = React.createContext<ContextProps>({} as ContextProps);

const ServerFiltersProvider: React.FC = ({ children }) => {
  const [filterWorker, { status: filterStatus, kill: killFilterWorker }] = useWorker(filterServers);
  const { servers, setFilteredServers } = useContext(ServersContext);

  const [filtersActive, setFiltersActive] = useState<number>(0);

  const [serverName, setServerName] = useState<string>('');
  const debouncedServerName = useDebounce(serverName, 500);
  const [serverIsland, setServerIsland] = useState<string>('');
  const [serverVersion, setServerVersion] = useState<string>('');
  const [isFirstPersonOnly, setIsFirstPersonOnly] = useState<boolean>(false);
  const [isOfficial, setIsOfficial] = useState<boolean>(false);
  const [isExperimental, setIsExperimental] = useState<boolean>(false);
  const [hasNoQueue, setHasNoQueue] = useState<boolean>(false);
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
    if (servers?.length === 0) return;

    // Kill the worker if it's running
    if ([WORKER_STATUS.PENDING, WORKER_STATUS.RUNNING].includes(filterStatus)) killFilterWorker();

    (async () => {
      const filterResult = await filterWorker(
        servers,
        DAYZ_EXP_APPID,
        debouncedServerName,
        serverIsland,
        serverVersion,
        serverMods,
        isFirstPersonOnly,
        isOfficial,
        isExperimental,
        hasNoQueue
      );
      setFilteredServers(filterResult.servers);
      setFiltersActive(filterResult.filtersActive);
    })();
  }, [
    servers,
    setFilteredServers,
    debouncedServerName,
    serverIsland,
    serverVersion,
    serverMods,
    isFirstPersonOnly,
    isOfficial,
    isExperimental,
    hasNoQueue,
  ]);

  return (
    <ServerFiltersContext.Provider
      value={{
        resetFilters,
        filtersActive,
        serverName: debouncedServerName,
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
