import React, { useEffect, useMemo, useState } from 'react';
import { generateServerParams, openDayzGame } from '../services/Steam';
import { Server } from '../types/Types';

type ContextProps = {
  joinServer: (server: Server) => boolean;
};

export const GameContext = React.createContext<ContextProps>({
  joinServer: (server: Server) => false,
});

const GameProvider: React.FC = ({ children }) => {
  const [inGameNickname, setInGameNickname] = useState<string>('');

  useEffect(() => {
    init();
  }, []);

  async function init() {}

  // Other methods below

  const nameParam: string[] = useMemo(() => (!!inGameNickname ? [`-name=${inGameNickname}`] : []), [inGameNickname]);

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
