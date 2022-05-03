import useSWR from 'swr';
import { fetcher } from '../data/fetcher';
import { WorkshopMod } from '../types/Types';

export default function useWorkshopMods(modIds: string[]): {
  workshopMods: WorkshopMod[];
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error } = useSWR<WorkshopMod[]>(`/api/steam/getWorkshopMods?modIds=${encodeURI(modIds.join(','))}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    isPaused: () => modIds.length === 0,
  });

  return {
    workshopMods: data || [],
    isLoading: !error && !data && modIds.length > 0,
    isError: error,
  };
}
