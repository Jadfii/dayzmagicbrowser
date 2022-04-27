import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import prisma, { serialiseServer } from '../../../lib/prisma';
import { Text } from '@geist-ui/react';
import React, { useEffect } from 'react';
import { generateServerParams, openDayzGame } from '../../../services/Steam';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.serverIp || !params?.serverPort) {
    return {
      notFound: true,
    };
  }

  const server = await prisma.server.findFirst({
    where: {
      ipAddress: String(params?.serverIp),
      gamePort: Number(params?.serverPort),
    },
    include: {
      relatedIsland: true,
    },
  });

  if (!server?.ipAddress) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      server: serialiseServer(server),
    },
  };
};

const PlayServer: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ server }) => {
  useEffect(() => {
    if (!server?.name) return;

    openDayzGame(server.appId, generateServerParams(server));
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
