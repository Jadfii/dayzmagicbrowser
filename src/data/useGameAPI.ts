import { get } from '../services/HTTP';
import { VersionResponse } from '../types/ResponseTypes';

const useGameAPI = () => {
  async function getLatestGameVersion(): Promise<VersionResponse | undefined> {
    try {
      const res = await get(`game/version`);

      return res.version;
    } catch (e) {
      console.error('Failed to get latest game version.', e);
      return undefined;
    }
  }

  return { getLatestGameVersion };
};

export default useGameAPI;
