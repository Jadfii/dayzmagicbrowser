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
  return servers.filter((server) => {
    let shouldInclude = true;
    const setShouldInclude = (include: boolean) => {
      shouldInclude = shouldInclude && include;
    };

    if (serverName) {
      setShouldInclude(server?.name?.toLowerCase().includes(serverName.toLowerCase()));
    }

    if (serverIsland) {
      setShouldInclude(server?.island?.toLowerCase().includes(serverIsland.toLowerCase()));
    }

    if (serverVersion) {
      setShouldInclude(server?.version === serverVersion);
    }

    if (serverMods.length > 0) {
      setShouldInclude(serverMods.every((mod) => server?.mods.find((m) => mod === m.steamId)));
    }

    if (isFirstPersonOnly === true) {
      setShouldInclude(server?.isFirstPerson === isFirstPersonOnly);
    }

    if (isOfficial === true) {
      setShouldInclude(server?.isPublicHive === isOfficial);
    }

    if (isExperimental === true) {
      setShouldInclude(server?.appId === expAppId);
    }

    if (hasNoQueue === true) {
      setShouldInclude(server?.queue === 0);
    }

    return shouldInclude;
  });
};

type ContextProps = {
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

  const [serverName, setServerName] = useState<string>('');
  const debouncedServerName = useDebounce(serverName, 500);
  const [serverIsland, setServerIsland] = useState<string>('');
  const [serverVersion, setServerVersion] = useState<string>('');
  const [isFirstPersonOnly, setIsFirstPersonOnly] = useState<boolean>(false);
  const [isOfficial, setIsOfficial] = useState<boolean>(false);
  const [isExperimental, setIsExperimental] = useState<boolean>(false);
  const [hasNoQueue, setHasNoQueue] = useState<boolean>(false);
  const [serverMods, setServerMods] = useState<string[]>([]);

  useEffect(() => {
    if (servers?.length === 0) return;

    // Kill the worker if it's running
    if ([WORKER_STATUS.PENDING, WORKER_STATUS.RUNNING].includes(filterStatus)) killFilterWorker();

    (async () => {
      setFilteredServers(
        await filterWorker(
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
        )
      );
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
