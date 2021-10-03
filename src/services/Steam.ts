import { DAYZ_APPID } from '../constants/game.constant';
import { Server } from '../types/Types';

const generateParams = (params: string[]): string => params.join(' ');

const openSteamGame = (appId: number, params: string[]): boolean => {
  const finalParams: string = generateParams(params);
  const connectURI = `steam://run/${appId}//${finalParams}/`;

  try {
    window.open(connectURI, '_blank');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const openDayzGame = (params: string[]): boolean => openSteamGame(DAYZ_APPID, params);

export const generateConnectParam = (ip: string, port: number) => `+connect ${ip}:${port}`;
export const generateServerParams = (server: Server): string[] => [generateConnectParam(server.ip, server.gamePort)];
