import { Text } from '@geist-ui/react';
import React, { useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { GameContext } from '../../contexts/GameProvider';
import { ServersContext } from '../../contexts/ServersProvider';

const PlayServer: React.FC = () => {
  const router = useRouter();
  const { serverIp, serverPort } = router.query;
  const { joinServer } = useContext(GameContext);
  const { findServerByIpPort } = useContext(ServersContext);

  const server = useMemo(
    () => findServerByIpPort(serverIp as string, Number(serverPort as string), true),
    [findServerByIpPort, serverIp, serverPort]
  );

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
