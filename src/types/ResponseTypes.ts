export interface ServerObjectResponse {
  _id: string;
  id?: string;
  ip: string;
  query_port: number;
  game_port: number;
  name: string;
  app_id: number;
  version: string;
  players: number;
  max_players: number;
  queue: number;
  time: string;
  first_person: boolean;
  map: string;
  time_acceleration: string;
  password: boolean;
  battleeye: boolean;
  vac: boolean;
  public_hive: boolean;
  offline: boolean;
  monetized?: boolean;
  geo: ServerGeoDataResponse;
  mods: ServerModResponse[];
}

export interface ServerGeoDataResponse {
  country_code?: string;
  country?: string;
}

export interface ServerResponse {
  limit: number;
  page: number;
  results: ServerObjectResponse[];
  totalPages: number;
  totalResults: number;
}

export interface ServerModResponse {
  id: string;
  name: string;
}

export interface IslandResponse {
  _id: string;
  terrain: string;
  name: string;
  description?: string;
  thumbnail: string;
  workshop_id?: string;
  official: boolean;
}

export interface WorkshopModTagResponse {
  tag: string;
}

export interface WorkshopModResponse {
  ban_reason: string;
  banned: number;
  consumer_app_id: number;
  creator: string;
  creator_app_id: number;
  description: string;
  favorited: number;
  file_size: number;
  file_url: string;
  filename: string;
  hcontent_file: string;
  hcontent_preview: string;
  lifetime_favorited: number;
  lifetime_subscriptions: number;
  preview_url: string;
  publishedfileid: string;
  result: number;
  subscriptions: number;
  tags: WorkshopModTagResponse[];
  time_created: number;
  time_updated: number;
  title: string;
  views: number;
  visibility: number;
}

export interface VersionResponse {
  stable: string;
  exp: string;
}
