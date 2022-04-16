export interface ServerTimeAcceleration {
  day: number;
  night: number;
}

// Duration of each cycle in ms
export interface ServerTimeDuration {
  day: number;
  night: number;
}

export interface ServerGeoData {
  countryCode: string | null;
  country: string | null;
}

export interface Server {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  modIds: number[];
  queryPort: number;
  gamePort: number;
  appId: number;
  playerCount: number;
  maxPlayerCount: number;
  queueCount: number;
  timeAcceleration: number[];
  ipAddress: string;
  name: string;
  version: string;
  clockTime: string;
  island: string;
  isFirstPerson: boolean;
  isPassword: boolean;
  isBattleEye: boolean;
  isVAC: boolean;
  isPublicHive: boolean;
  isMonetised: boolean;
  isOffline: boolean;
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

export interface Island {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  terrainId: string;
  name: string;
  description: string | null;
  workshopId: string | null;
  isOfficial: boolean;
}

export interface WorkshopMod {
  id: string;
  banned: boolean;
  appId: number;
  creatorSteamId: string;
  description: string;
  favourited: number;
  fileSize: number;
  subscriptions: number;
  previewURL: string;
  success: boolean;
  tags: string[];
  name: string;
  views: number;
  visibility: number;
}

export interface HomeServers {
  popular: Server[];
  official: Server[];
  experimental: Server[];
}

export interface ServerFilters {
  name?: string;
  map?: string;
  version?: string;
  limit?: number;
}

export interface GameVersion {
  stable: string;
  exp: string;
}

export interface SelectOption {
  label?: string;
  value: string;
  count: number;
  highlighted?: boolean;
  highlightedSecondary?: boolean;
}
