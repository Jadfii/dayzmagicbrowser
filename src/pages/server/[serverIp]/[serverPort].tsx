import ServerPage from '../../../views/ServerPage/ServerPage';
import { get } from 'services/HTTP';
import { ServerObjectResponse } from 'types/ResponseTypes';

export default ServerPage;

export const getStaticPaths = async () => {
  const res = await get('servers', { limit: 10000, sortBy: 'players:desc' });
  const servers: ServerObjectResponse[] = res?.results || [];

  return {
    paths: servers?.map((server: ServerObjectResponse) => ({ params: { serverIp: server?.ip, serverPort: server?.query_port } })),
    fallback: true,
  };
};

export const getStaticProps = async () => {
  return {
    props: { server: undefined },
  };
};
