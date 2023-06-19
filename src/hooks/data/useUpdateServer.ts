import { Endpoint } from './../../types/Endpoints';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Server } from '../../types/Types';
import { fetcher } from '../../data/fetcher';

export default function useUpdateServer() {
  const queryClient = useQueryClient();

  const query = useMutation<unknown, unknown, { ipAddress?: Server['ipAddress']; gamePort?: Server['gamePort'] }>({
    mutationFn: async (variables) => {
      return await fetcher(`${Endpoint.SERVERS}/${variables.ipAddress}/${variables.gamePort}/update`, { method: 'PATCH' });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [`${Endpoint.SERVERS}/${variables?.ipAddress}/${variables?.gamePort}`] });
    },
  });

  return query;
}
