import { get } from '../services/HTTP';
import { ServerObjectResponse } from '../types/ResponseTypes';
import { Server } from '../types/Types';
import { mapServerResponse } from './Mapper';

const useServersAPI = () => {
  async function getServers(): Promise<Server[]> {
    try {
      const res = await get('servers');

      if (res?.length) {
        console.log(`Loaded ${res?.length} servers.`);
      }

      return (res || []).map((server: ServerObjectResponse) => mapServerResponse(server));
    } catch (e) {
      console.error('Failed to get game servers.', e);
      return [];
    }
  }

  return { getServers };
};

export default useServersAPI;
