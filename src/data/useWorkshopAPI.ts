import { WorkshopModResponse } from '../types/ResponseTypes';
import { get } from '../services/HTTP';
import { WorkshopMod } from '../types/Types';
import { mapWorkshopModResponse } from './Mapper';

const useWorkshopAPI = () => {
  async function getWorkshopMods(fileIds: string[]): Promise<WorkshopMod[]> {
    try {
      const res = await get(`workshop/getMods/${fileIds.join(',')}`);

      return res.map((mod: WorkshopModResponse) => mapWorkshopModResponse(mod));
    } catch (e) {
      console.error('Failed to get workshop mods.', e);
      return [];
    }
  }

  return { getWorkshopMods };
};

export default useWorkshopAPI;
