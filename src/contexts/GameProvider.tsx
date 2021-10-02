import React, { useMemo, useState } from 'react';
import { generateServerParams, openDayzGame } from '../services/Steam';
import { Server } from '../types/Types';

type ContextProps = {
  joinServer: (server: Server) => boolean;
};

export const GameContext = React.createContext<ContextProps>({} as ContextProps);

const GameProvider: React.FC = ({ children }) => {
  const [inGameNickname] = useState<string>('');

  // Other methods below

  const nameParam: string[] = useMemo(() => (inGameNickname ? [`-name=${inGameNickname}`] : []), [inGameNickname]);

  const joinServer = (server: Server) => {
    return openDayzGame([...generateServerParams(server), ...nameParam]);
  };

  return (
    <GameContext.Provider
      value={{
        joinServer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
