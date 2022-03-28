import { GetServerSideProps } from 'next';
import prisma, { serialiseServer } from '../../../lib/prisma';
import { Text } from '@geist-ui/react';
import React, { useContext, useEffect } from 'react';
import { Server } from '../../../types/Types';

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
  });

  if (!server?.ipAddress) {
    return {
      notFound: true,
    };
  }

  return {
    props: { server: serialiseServer(server) },
  };
};

interface Props {
  server?: Server;
}

const PlayServer: React.FC<Props> = ({ server }) => {
  useEffect(() => {
    if (!server?.name) return;
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
