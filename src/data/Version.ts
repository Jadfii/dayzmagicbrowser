import http from '../services/HTTP';
import { GameVersion } from '../types/Types';

export const getGameVersion = async (): Promise<GameVersion> =>
  await http
    .get('https://dayzmagiclauncher.com/version')
    .then((response) => response.json())
    .then((data) => ({ stable: data?.version, exp: data?.version_exp }));

export const isMatchingVersion = (versionOne: string, versionTwo: string): boolean =>
  versionOne?.replace(new RegExp('.', 'g'), '')?.replace(new RegExp('0', 'g'), '') ===
  versionTwo?.replace(new RegExp('.', 'g'), '')?.replace(new RegExp('0', 'g'), '');
