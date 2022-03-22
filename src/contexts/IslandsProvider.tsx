import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  const refreshIslands = useCallback(async () => {
    setIslands(await getIslands());
  }, [setIslands]);

  const getIslandByTerrain = useCallback(
    (terrainId: string) => {
      if (typeof terrainId !== 'string') return undefined;

      return islands.find((island) => terrainId?.toLowerCase().includes(island.terrainId.toLowerCase()));
    },
    [islands]
  );

  const exportValue = useMemo(
    () => ({
      islands,
      refreshIslands,
      getIslandByTerrain,
    }),
    [islands, refreshIslands, getIslandByTerrain]
  );

  return <IslandsContext.Provider value={exportValue}>{children}</IslandsContext.Provider>;
};

export default IslandsProvider;
