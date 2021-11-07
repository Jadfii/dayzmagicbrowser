import { GetServerSideProps } from 'next';
import { HomeServerResponse, ServerObjectResponse } from '../types/ResponseTypes';
import { mapServerResponse } from '../data/Mapper';
import { get } from '../services/HTTP';

import Home from '../views/Home/Home';

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const data: HomeServerResponse = await get(`servers/home`);

  return {
    props: {
      homeServers: Object.fromEntries(
        Object.entries(data).map(([key, val]) => [key, val.map((server: ServerObjectResponse) => mapServerResponse(server))])
      ),
    },
  };
};
