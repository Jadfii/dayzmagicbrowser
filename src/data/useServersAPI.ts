import { get } from '../services/HTTP';
import { ServerObjectResponse } from '../types/ResponseTypes';
import { Server } from '../types/Types';
import { mapServerResponse } from './Mapper';

const useServersAPI = () => {
  async function getServers(): Promise<Server[]> {
    try {
      const res = await get('servers', { limit: 10000 });

      if (res?.results) {
        console.log(`Loaded ${res?.results.length} servers.`);
      }

      return (res?.results || []).map((server: ServerObjectResponse) => mapServerResponse(server));
    } catch (e) {
      console.error('Failed to get game servers.', e);
      return [];
    }
  }

  return { getServers };
};

export default useServersAPI;
