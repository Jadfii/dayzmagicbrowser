import useSWR from 'swr';
import { fetcher } from '../data/fetcher';
import { GameVersion } from '../types/Types';

export default function useDayzVersion(): {
  dayzVersion: GameVersion | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error, isLoading } = useSWR<GameVersion>('/api/steam/version', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    dayzVersion: data,
    isLoading: isLoading,
    isError: error,
  };
}
