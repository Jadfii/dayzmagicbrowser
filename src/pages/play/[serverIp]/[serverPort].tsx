import PlayServer from '../../../views/PlayServer/PlayServer';
import { get } from 'services/HTTP';
import { ServerObjectResponse } from 'types/ResponseTypes';

export default PlayServer;

export const getStaticPaths = async () => {
  const res = await get('servers', { limit: 10000, sortBy: 'players:desc' });
  const servers: ServerObjectResponse[] = res?.results || [];

  return {
    paths: servers?.map((server: ServerObjectResponse) => ({ params: { serverIp: `${server?.ip}`, serverPort: `${server?.query_port}` } })),
    fallback: false,
  };
};

export const getStaticProps = async () => {
  return {
    props: { serverIp: '1', serverPort: '2' },
  };
};
