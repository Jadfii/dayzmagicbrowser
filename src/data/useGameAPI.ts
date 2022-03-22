import { get } from '../services/HTTP';
import { VersionResponse } from '../types/ResponseTypes';

const useGameAPI = () => {
  async function getLatestGameVersion(): Promise<VersionResponse | undefined> {
    try {
      const res = await get(`game/version`);

      return res.version;
    } catch (err) {
      console.error('Failed to get latest game version.', err);
      return undefined;
    }
  }

  return { getLatestGameVersion };
};

export default useGameAPI;
