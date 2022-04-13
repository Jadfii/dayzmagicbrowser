import { atom, selector, selectorFamily } from 'recoil';
import { Island } from '../types/Types';

async function getAllIslands(): Promise<Island[]> {
  try {
    if (global.window) {
      const response = (await fetch('/api/islands').then((response) => response.json())) || [];
      return response || [];
    } else {
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const allIslandsQuery = selector<Island[]>({
  key: 'allIslands',
  get: async () => {
    const islands = await getAllIslands();

    return islands;
  },
});

export const islandListState = atom<Island[]>({
  key: 'islandList',
  default: allIslandsQuery,
});

export const findIslandByTerrainIdState = selectorFamily({
  key: 'findIslandByTerrainId',
  get:
    (terrainId: string) =>
    ({ get }) => {
      const islands = get(islandListState);

      return islands.find((island) => (terrainId?.toLowerCase() || '').includes(island?.terrainId?.toLowerCase()));
    },
});
