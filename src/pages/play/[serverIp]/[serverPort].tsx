import { GetServerSideProps } from 'next';
import { mapServerResponse } from '../../../data/Mapper';
import { get } from '../../../services/HTTP';
import { Text } from '@geist-ui/react';
import React, { useContext, useEffect } from 'react';
import { GameContext } from '../../../contexts/GameProvider';
import { Server } from '../../../types/Types';

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

interface Props {
  server?: Server;
}

const PlayServer: React.FC<Props> = ({ server }) => {
  const { joinServer } = useContext(GameContext);

  useEffect(() => {
    if (!server?.name) return;

    if (joinServer) joinServer(server);
  }, [server]);

  return (
    <div className="relative flex items-center justify-center flex-auto">
      {server?.name ? (
        <div>
          <Text h2>Connecting to {server?.name}</Text>
        </div>
      ) : null}
    </div>
  );
};

export default PlayServer;
