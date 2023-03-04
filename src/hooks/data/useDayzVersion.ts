import { Endpoint } from './../../types/Endpoints';
import { useQuery } from '@tanstack/react-query';
import { GameVersion } from '../../types/Types';

export default function useDayzVersion() {
  const query = useQuery<GameVersion>({
    queryKey: [Endpoint.GAME_VERSION],
    refetchOnWindowFocus: false,
  });

  return query;
}
