import { useToasts } from '@geist-ui/react';
import React, { useContext, useMemo, useState } from 'react';
import { generateConnectParam, generateServerParams, openDayzGame } from '../services/Steam';
import { Server } from '../types/Types';
import { ServersContext } from './ServersProvider';

type ContextProps = {
  joinServer: (server: Server) => boolean;
  joinServerByIpPort: (serverIp: string, serverPort: number) => boolean;
};

export const GameContext = React.createContext<ContextProps>({} as ContextProps);

const GameProvider: React.FC = ({ children }) => {
  const [, setToast] = useToasts();
  const { findServerByIpPort } = useContext(ServersContext);
  const [inGameNickname] = useState<string>('');

  // Other methods below

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
    const result = openDayzGame(server.appId, [...generateConnectParam(server.ip, server.gamePort), ...nameParam]);

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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
