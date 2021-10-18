import { GetServerSideProps } from 'next';
import { mapServerResponse } from '../../../data/Mapper';
import { get } from '../../../services/HTTP';
import ServerPage from '../../../views/ServerPage/ServerPage';

export default ServerPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.serverIp || !params?.serverPort) {
    return {
      notFound: true,
    };
  }

  const data = await get(`servers/${encodeURIComponent(params?.serverIp as string)}/${encodeURIComponent(params?.serverPort as string)}`);
  if (!data?.ip) {
    return {
      notFound: true,
    };
  }

  return {
    props: { server: mapServerResponse(data) },
  };
};
