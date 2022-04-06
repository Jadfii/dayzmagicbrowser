import { IslandResponse, ServerGeoDataResponse, WorkshopModResponse } from '../types/ResponseTypes';
import { Island, ServerGeoData, ServerTimeAcceleration, WorkshopMod } from '../types/Types';

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
  appId: mod.consumer_app_id,
  creatorSteamId: mod.creator,
  description: mod.description,
  favourited: mod.favorited,
  fileSize: mod.file_size,
  subscriptions: mod.subscriptions,
  previewURL: mod.preview_url,
  success: mod.result === 1,
  tags: mod.tags?.length ? mod.tags.map((t) => t.tag) : [],
  views: mod.views,
  visibility: mod.visibility,
});
