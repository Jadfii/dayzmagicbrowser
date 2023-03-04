import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { WorkshopMod } from '../../types/Types';

export default function useSearchWorkshopMods(searchTerm: string) {
  const query = useQuery<WorkshopMod[]>({
    queryKey: [`${Endpoint.WORKSHOP_SEARCH}?term=${encodeURI(searchTerm)}`],
    enabled: searchTerm.length > 0,
  });

  return query;
}
