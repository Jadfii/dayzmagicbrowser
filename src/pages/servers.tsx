import { GetStaticProps } from 'next';
import { ServerResponse } from '../types/ResponseTypes';
import { mapServerResponse } from '../data/Mapper';
import { get } from '../services/HTTP';

import Servers from '../views/Servers/Servers';

export default Servers;

export const getStaticProps: GetStaticProps = async () => {
  const data: ServerResponse = await get(`servers`, { limit: 10000, sortBy: 'players:desc' });

  return {
    props: {
      servers: (data?.results?.map((server) => mapServerResponse(server)) || []).sort((a, b) => b.players + b.queue - (a.players + a.queue)),
    },
    revalidate: 60, // Fetch new data every 60 seconds
  };
};
