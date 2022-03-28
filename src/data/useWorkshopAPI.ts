import { WorkshopModResponse } from '../types/ResponseTypes';
import { get } from '../services/HTTP';
import { WorkshopMod } from '../types/Types';
import { mapWorkshopModResponse } from './Mapper';

const useWorkshopAPI = () => {
  async function getWorkshopMods(fileIds: number[]): Promise<WorkshopMod[]> {
    try {
      const res = await get(`workshop/getMods/${fileIds.join(',')}`);

      return res.map((mod: WorkshopModResponse) => mapWorkshopModResponse(mod));
    } catch (err) {
      console.error('Failed to get workshop mods.', err);
      return [];
    }
  }

  return { getWorkshopMods };
};

export default useWorkshopAPI;
