import useSWR from 'swr';
import { fetcher } from '../data/fetcher';
import { GameVersion } from '../types/Types';

export default function useDayzVersion(): {
  dayzVersion: GameVersion | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error } = useSWR<GameVersion>('/api/steam/getDayzVersion', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    dayzVersion: data,
    isLoading: !error && !data,
    isError: error,
  };
}
