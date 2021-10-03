import React, { useMemo, useState } from 'react';
import { generateConnectParam, generateServerParams, openDayzGame } from '../services/Steam';
import { Server } from '../types/Types';

type ContextProps = {
  joinServer: (server: Server) => boolean;
  joinServerByIpPort: (serverIp: string, serverPort: number) => boolean;
};

export const GameContext = React.createContext<ContextProps>({} as ContextProps);

const GameProvider: React.FC = ({ children }) => {
  const [inGameNickname] = useState<string>('');

  // Other methods below

  const nameParam: string[] = useMemo(() => (inGameNickname ? [`-name=${inGameNickname}`] : []), [inGameNickname]);

  const joinServer = (server: Server) => {
    return openDayzGame([...generateServerParams(server), ...nameParam]);
  };

  const joinServerByIpPort = (serverIp: string, serverPort: number) => {
    return openDayzGame([...generateConnectParam(serverIp, serverPort), ...nameParam]);
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
