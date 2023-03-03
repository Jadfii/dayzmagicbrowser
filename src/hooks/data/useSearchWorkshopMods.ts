import useSWR from 'swr';
import { fetcher } from '../../data/fetcher';
import { WorkshopMod } from '../../types/Types';

export default function useSearchWorkshopMods(seachTerm: string): {
  workshopMods: WorkshopMod[];
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error, isLoading } = useSWR<WorkshopMod[]>(`/api/steam/workshop/search?term=${encodeURI(seachTerm)}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    isPaused: () => seachTerm.length === 0,
  });

  return {
    workshopMods: data || [],
    isLoading: isLoading && seachTerm.length > 0,
    isError: error,
  };
}
