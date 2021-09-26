import React, { useCallback, useEffect, useState } from 'react';
import { Island } from '../types/Types';
import useIslandsAPI from '../data/useIslandsAPI';

type ContextProps = {
  islands: Island[];
  refreshIslands: () => void;
  getIslandByTerrain: (island: string) => Island | undefined;
};

export const IslandsContext = React.createContext<ContextProps>({
  islands: [],
  refreshIslands: () => undefined,
  getIslandByTerrain: (island: string) => undefined,
});

const IslandsProvider: React.FC = ({ children }) => {
  const { getIslands } = useIslandsAPI();
  const [islands, setIslands] = useState<Island[]>([]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    refreshIslands();
  }

  // Other methods below

  async function refreshIslands() {
    setIslands(await getIslands());
  }

  const getIslandByTerrain = useCallback((island: string) => islands.find((i) => i.terrainId === island), [islands]);

  return (
    <IslandsContext.Provider
      value={{
        islands,
        refreshIslands,
        getIslandByTerrain,
      }}
    >
      {children}
    </IslandsContext.Provider>
  );
};

export default IslandsProvider;
