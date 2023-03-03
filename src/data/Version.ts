import http from '../services/HTTP';
import { MagicLauncher_Version_Response } from '../types/ResponseTypes';
import { GameVersion } from '../types/Types';

export const EMPTY_GAME_VERSION: GameVersion = { stable: '', exp: '' };

export const getGameVersion = async (): Promise<GameVersion | undefined> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds

  try {
    const res = await http<MagicLauncher_Version_Response>('https://dayzmagiclauncher.com/version', { signal: controller.signal }).then((data) => ({
      stable: data?.version,
      exp: data?.version_exp,
    }));

    return res;
  } catch (err) {
    // do nothing
  }

  clearTimeout(timeoutId);
  return undefined;
};

export const isMatchingVersion = (versionOne?: string, versionTwo?: string): boolean =>
  !!versionOne &&
  !!versionTwo &&
  versionOne?.replace(/\./g, '')?.replace(new RegExp('0', 'g'), '') === versionTwo?.replace(/\./g, '')?.replace(new RegExp('0', 'g'), '');
