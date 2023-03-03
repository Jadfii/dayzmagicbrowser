import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { WorkshopMod } from '../../types/Types';

export default function useWorkshopMods(modIds: string[]) {
  const query = useQuery<WorkshopMod[]>({
    queryKey: [`${Endpoint.WORKSHOP_MODS}`, `modIds=${encodeURI(modIds.join(','))}`],
    refetchOnWindowFocus: false,
    enabled: modIds.length > 0,
  });

  return query;
}
