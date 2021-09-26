import React, { useEffect, useState } from 'react';
import { Island } from '../types/Types';
import useIslandsAPI from '../data/useIslandsAPI';

type ContextProps = {
  islands: Island[];
  refreshIslands: () => void;
};

export const IslandsContext = React.createContext<ContextProps>({
  islands: [],
  refreshIslands: () => undefined,
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

  return (
    <IslandsContext.Provider
      value={{
        islands,
        refreshIslands,
      }}
    >
      {children}
    </IslandsContext.Provider>
  );
};

export default IslandsProvider;
