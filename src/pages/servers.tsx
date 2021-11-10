import { GetStaticProps } from 'next';
import { ServerObjectResponse } from '../types/ResponseTypes';
import { mapServerResponse } from '../data/Mapper';
import { get } from '../services/HTTP';

import Servers from '../views/Servers/Servers';

export default Servers;

export const getStaticProps: GetStaticProps = async () => {
  const data: ServerObjectResponse[] = await get(`servers/all`, { exclude: ['mods', 'createdAt', 'updatedAt'].join(',') });

  return {
    props: {
      servers: (data?.map((server) => mapServerResponse(server)) || []).sort((a, b) => b.players + b.queue - (a.players + a.queue)),
    },
    revalidate: 60, // Fetch new data every 60 seconds
  };
};
