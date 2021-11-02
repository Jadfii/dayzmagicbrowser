import { useToasts } from '@geist-ui/react';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useGameAPI from '../data/useGameAPI';
import { generateConnectParam, generateServerParams, openDayzGame } from '../services/Steam';
import { Server } from '../types/Types';
import { ServersContext } from './ServersProvider';

type ContextProps = {
  joinServer: (server: Server) => boolean;
  joinServerByIpPort: (serverIp: string, serverPort: number) => boolean;
  isLatestGameVersion: (version: string, experimental?: boolean) => boolean;
  latestGameVersion: string;
  latestExpGameVersion: string;
};

export const GameContext = React.createContext<ContextProps>({} as ContextProps);

const GameProvider: React.FC = ({ children }) => {
  const [, setToast] = useToasts();
  const { getLatestGameVersion } = useGameAPI();
  const { findServerByIpPort } = useContext(ServersContext);
  const [latestGameVersion, setLatestGameVersion] = useState<string>('');
  const [latestExpGameVersion, setLatestExpGameVersion] = useState<string>('');
  const [inGameNickname] = useState<string>('');

  async function init() {
    getGameVersion();
  }

  useEffect(() => {
    init();
  }, []);

  // Other methods below

  const getGameVersion = async () => {
    const versions = await getLatestGameVersion();
    setLatestGameVersion(versions?.stable || '');
    setLatestExpGameVersion(versions?.exp || '');
  };

  const isLatestGameVersion = useCallback(
    (version: string, experimental?: boolean) =>
      typeof version === 'string' && version.replaceAll('.', '') === (experimental ? latestExpGameVersion : latestGameVersion).replaceAll('.', ''),
    [latestGameVersion, latestExpGameVersion]
  );

  const nameParam: string[] = useMemo(() => (inGameNickname ? [`-name=${inGameNickname}`] : []), [inGameNickname]);

  const joinServer = (server: Server) => {
    const result = openDayzGame(server.appId, [...generateServerParams(server), ...nameParam]);

    if (result) {
      setToast({ text: `Joining server ${server.name}`, type: 'success' });
    }

    return result;
  };

  const joinServerByIpPort = (serverIp: string, serverPort: number) => {
    const server = findServerByIpPort(serverIp, serverPort, true);
    if (!server?.ip) throw new Error('Server not found');
    const result = openDayzGame(server.appId, [generateConnectParam(server.ip, server.gamePort), ...nameParam]);

    if (result) {
      setToast({ text: `Joining server ${serverIp}:${serverPort}`, type: 'success' });
    }

    return result;
  };

  return (
    <GameContext.Provider
      value={{
        joinServer,
        joinServerByIpPort,
        isLatestGameVersion,
        latestGameVersion,
        latestExpGameVersion,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
