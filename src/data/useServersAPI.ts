import { get } from '../services/HTTP';
import { ServerObjectResponse } from '../types/ResponseTypes';
import { Server, ServerFilters } from '../types/Types';
import { mapServerResponse } from './Mapper';

const useServersAPI = () => {
  async function getServers(filters?: ServerFilters): Promise<Server[]> {
    try {
      const res = await get('servers', { limit: 1000, sortBy: 'players:desc', ...(filters || {}) });

      if (res?.results?.length) {
        console.log(`Loaded ${res?.results?.length} servers.`);
      }

      return (res?.results || []).map((server: ServerObjectResponse) => mapServerResponse(server));
    } catch (err) {
      console.error('Failed to get game servers.', err);
      return [];
    }
  }

  async function searchServers(searchTerm: string): Promise<Server[]> {
    try {
      const res = await get(`servers/search/${encodeURIComponent(searchTerm)}`);

      return (res || []).map((server: ServerObjectResponse) => mapServerResponse(server));
    } catch (err) {
      console.error('Failed to search game servers.', err);
      return [];
    }
  }

  return { getServers, searchServers };
};

export default useServersAPI;
