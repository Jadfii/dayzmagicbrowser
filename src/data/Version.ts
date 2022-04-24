import http from '../services/HTTP';
import { GameVersion } from '../types/Types';

export const getGameVersion = async (): Promise<GameVersion> =>
  await http
    .get('https://dayzmagiclauncher.com/version')
    .then((response) => response.json())
    .then((data) => ({ stable: data?.version, exp: data?.version_exp }));

export const isMatchingVersion = (versionOne: string, versionTwo: string): boolean =>
  versionOne?.replaceAll('.', '')?.replaceAll('0', '') === versionTwo?.replaceAll('.', '')?.replaceAll('0', '');
