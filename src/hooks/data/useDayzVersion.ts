import { useQuery } from '@tanstack/react-query';
import { GameVersion } from '../../types/Types';

export default function useDayzVersion() {
  const query = useQuery<GameVersion>({
    queryKey: ['/api/steam/version'],
    refetchOnWindowFocus: false,
  });

  return query;
}
