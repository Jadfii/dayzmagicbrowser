import useSWR from 'swr';
import { fetcher } from '../data/fetcher';
import { WorkshopMod } from '../types/Types';

export default function useWorkshopMods(modIds: string[]): {
  workshopMods: WorkshopMod[];
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error, isLoading } = useSWR<WorkshopMod[]>(`/api/steam/workshop?modIds=${encodeURI(modIds.join(','))}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    isPaused: () => modIds.length === 0,
  });

  return {
    workshopMods: data || [],
    isLoading: isLoading && modIds.length > 0,
    isError: error,
  };
}
