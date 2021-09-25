export interface ServerTimeAcceleration {
  day: number;
  night: number;
}

// Duration of each cycle in ms
export interface ServerTimeDuration {
  day: number;
  night: number;
}

export interface Server {
  id: string;
  ip: string;
  queryPort: number;
  gamePort: number;
  name: string;
  appId: number;
  version: string;
  players: number;
  maxPlayers: number;
  queue: number;
  time: string;
  island: string;
  timeAcceleration: ServerTimeAcceleration;
  timeDuration: ServerTimeDuration;
  hasPassword: boolean;
  isFirstPerson: boolean;
  isBattleEye: boolean;
  isVac: boolean;
  isPublicHive: boolean;
  isOffline: boolean;
  mods: ServerMod[];
}

export interface ServerMod {
  steamId: string;
  name: string;
}

export enum ServerTime {
  SUNRISE = '04:00',
  DAY = '08:00',
  SUNSET = '18:00',
  NIGHT = '22:00',
}

export interface ServerSearchOption extends Server {
  label: string;
  value: string;
}
