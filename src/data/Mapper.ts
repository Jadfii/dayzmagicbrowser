import { IMAGE_BUCKET } from '../constants/links.constant';
import { IslandResponse, ServerObjectResponse } from '../types/ResponseTypes';
import { Island, Server, ServerTimeAcceleration } from '../types/Types';
import { getServerTimeDuration } from '../utils/time.util';

export const getServerTimeAcceleration = (acceleration: string): ServerTimeAcceleration => {
  const splitAcceleration: number[] = acceleration.split(',').map((acc) => Number(acc));

  if (splitAcceleration.length === 0) {
    return { day: 0, night: 0 };
  }

  return {
    day: splitAcceleration[0],
    night: splitAcceleration[1],
  };
};

export const mapServerResponse = (server: ServerObjectResponse): Server => ({
  id: server._id,
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
  mods: server.mods.map((mod) => ({ steamId: mod.id, name: mod.name })),
});

export const mapIslandResponse = (island: IslandResponse): Island => ({
  id: island._id,
  terrainId: island.terrain,
  name: island.name,
  description: island.description,
  imageURL: `${IMAGE_BUCKET}${island.thumbnail}.jpg`,
  workshopId: island.workshop_id,
});
