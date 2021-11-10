import { useToasts } from '@geist-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useGameAPI from '../data/useGameAPI';
import { generateServerParams, openDayzGame } from '../services/Steam';
import { Server } from '../types/Types';

type ContextProps = {
  joinServer: (server: Server) => boolean;
  isLatestGameVersion: (version: string, experimental?: boolean) => boolean;
  latestGameVersion: string;
  latestExpGameVersion: string;
};

export const GameContext = React.createContext<ContextProps>({} as ContextProps);

const GameProvider: React.FC = ({ children }) => {
  const [, setToast] = useToasts();
  const { getLatestGameVersion } = useGameAPI();
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
      version.replace(new RegExp('\\.', 'g'), '') === (experimental ? latestExpGameVersion : latestGameVersion).replace(new RegExp('\\.', 'g'), ''),
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

  return (
    <GameContext.Provider
      value={{
        joinServer,
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
