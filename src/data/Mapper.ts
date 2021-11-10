import { IMAGE_BUCKET } from '../constants/links.constant';
import { IslandResponse, ServerGeoDataResponse, ServerObjectResponse, WorkshopModResponse } from '../types/ResponseTypes';
import { Island, Server, ServerGeoData, ServerTimeAcceleration, WorkshopMod } from '../types/Types';
import { getServerTimeDuration } from '../utils/time.util';

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

export const mapServerGeoDataResponse = (data: ServerGeoDataResponse): ServerGeoData => ({
  countryCode: data?.country_code || null,
  country: data?.country || null,
});

export const mapServerResponse = (server: ServerObjectResponse): Server => ({
  id: server._id || server.id || '',
  ip: server.ip,
  queryPort: server.query_port,
  gamePort: server.game_port,
  name: server.name,
  appId: server.app_id,
  version: server.version,
  players: server.players,
  maxPlayers: server.max_players,
  queue: server.queue,
  time: server.time,
  island: server.map,
  timeAcceleration: getServerTimeAcceleration(server.time_acceleration),
  timeDuration: getServerTimeDuration(getServerTimeAcceleration(server.time_acceleration)),
  hasPassword: server.password,
  isFirstPerson: server.first_person,
  isBattleEye: server.battleeye,
  isVac: server.vac,
  isPublicHive: server.public_hive,
  isOffline: server.offline,
  isMonetized: server.monetized || false,
  geo: mapServerGeoDataResponse(server.geo),
  mods: server.mods?.map((mod) => ({ steamId: mod.id.toString(), name: mod.name })) || [],
});

export const mapIslandResponse = (island: IslandResponse): Island => ({
  id: island._id,
  terrainId: island.terrain,
  name: island.name,
  description: island.description,
  imageURL: `${IMAGE_BUCKET}${island.thumbnail}`,
  workshopId: island.workshop_id,
});

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
