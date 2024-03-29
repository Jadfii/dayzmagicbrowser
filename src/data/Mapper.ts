import { WorkshopModResponse } from '../types/ResponseTypes';
import { ServerTimeAcceleration, WorkshopMod } from '../types/Types';

export const getServerTimeAcceleration = (acceleration?: string): ServerTimeAcceleration => {
  const splitAcceleration: number[] = acceleration?.split(',').map((acc) => Number(acc)) || [];

  if (splitAcceleration.length === 0) {
    return { day: 0, night: 0 };
  }

  return {
    day: splitAcceleration[0],
    night: splitAcceleration[1],
  };
};

export const mapWorkshopModResponse = (mod: WorkshopModResponse): WorkshopMod => ({
  id: mod.publishedfileid,
  name: mod.title,
  banned: mod.banned === 1,
  appId: mod.consumer_appid,
  fileSize: Number(mod.file_size),
  subscriptions: mod.subscriptions,
  success: mod.result === 1,
  visibility: mod.visibility,
});
