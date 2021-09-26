import { get } from '../services/HTTP';
import { Island } from '../types/Types';
import { IslandResponse } from '../types/ResponseTypes';
import { mapIslandResponse } from './Mapper';

interface Methods {
  getIslands: () => Promise<Island[]>;
}

const useIslandsAPI = (): Methods => {
  async function getIslands(): Promise<Island[]> {
    try {
      const res = await get('islands', { limit: 10000 });

      if (res?.results) {
        console.log(`Loaded ${res?.results.length} islands.`);
      }

      return (res?.results || []).map((island: IslandResponse) => mapIslandResponse(island));
    } catch (e) {
      console.error('Failed to get islands.', e);
      return [];
    }
  }

  return { getIslands };
};

export default useIslandsAPI;
