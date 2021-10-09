import { get } from '../services/HTTP';

const useGameAPI = () => {
  async function getLatestGameVersion(): Promise<string> {
    try {
      const res = await get(`game/version`);

      return res;
    } catch (e) {
      console.error('Failed to get latest game version.', e);
      return '';
    }
  }

  return { getLatestGameVersion };
};

export default useGameAPI;
