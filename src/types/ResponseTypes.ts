export interface ServerObjectResponse {
  _id: string;
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
  mods: ServerModResponse[];
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
