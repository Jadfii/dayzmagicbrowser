import { useQuery } from '@tanstack/react-query';
import { WorkshopMod } from '../../types/Types';

export default function useSearchWorkshopMods(searchTerm: string) {
  const query = useQuery<WorkshopMod[]>({
    queryKey: [`/api/steam/workshop/search?term=${encodeURI(searchTerm)}`],
    enabled: searchTerm.length > 0,
  });

  return query;
}
