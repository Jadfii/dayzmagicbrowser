import React, { useCallback, useEffect, useState } from 'react';
import { Island } from '../types/Types';
import useIslandsAPI from '../data/useIslandsAPI';

type ContextProps = {
  islands: Island[];
  refreshIslands: () => void;
  getIslandByTerrain: (terrainId: string) => Island | undefined;
};

export const IslandsContext = React.createContext<ContextProps>({} as ContextProps);

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

  const getIslandByTerrain = useCallback(
    (terrainId: string) => islands.find((island) => terrainId.toLowerCase().includes(island.terrainId.toLowerCase())),
    [islands]
  );

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
