import { ALLOWED_APPIDS } from '../constants/game.constant';
import { Server } from '../types/Types';

const generateParams = (params: string[]): string => encodeURIComponent(params.join(' '));

const openSteamGame = (appId: number, params: string[]): boolean => {
  const finalParams: string = generateParams(params);
  const connectURI = `steam://run/${appId}//${finalParams}/`;

  try {
    window?.open(connectURI, '_blank');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const openDayzGame = (appId: number, params: string[]): boolean => {
  if (!ALLOWED_APPIDS.includes(appId)) return false;
  return openSteamGame(appId, params);
};

export const generateConnectParam = (ip: string, port: number) => `+connect ${ip}:${port}`;
export const generateServerParams = (server: Server): string[] => [generateConnectParam(server.ipAddress, server.gamePort)];
export const getSteamConnectURI = (ip: string, port: number) => `steam://connect/${ip}:${port}`;
export const openSteamConnect = (ip: string, port: number) => {
  const connectURI = getSteamConnectURI(ip, port);

  try {
    window?.location?.assign(connectURI);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
