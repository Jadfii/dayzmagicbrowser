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
  createdAt?: string;
  updatedAt?: string;
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
  relatedIsland?: Island;
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
  createdAt?: string;
  updatedAt?: string;
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
  fileSize: number;
  subscriptions: number;
  success: boolean;
  name: string;
  visibility: number;
}

export interface HomeServers {
  popular: Server[];
  official: Server[];
  experimental: Server[];
}

export interface AvailableServerFilters {
  islands: SelectOption[];
  versions: SelectOption[];
  mods: SelectOption[];
}

export interface GameVersion {
  stable: string;
  exp: string;
}

export interface SelectOption {
  label?: string;
  value: string | number;
  count: number;
  highlighted?: boolean;
  highlightedSecondary?: boolean;
}

export enum SERVER_FILTERS {
  NAME = 'name',
  ISLAND = 'island',
  VERSION = 'version',
  MODS = 'mods',
  FIRST_PERSON = 'firstperson',
  OFFICIAL = 'official',
  EXPERIMENTAL = 'experimental',
  HAS_NO_QUEUE = 'noqueue',
}
