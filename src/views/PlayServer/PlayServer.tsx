import { Text } from '@geist-ui/react';
import React, { useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { GameContext } from '../../contexts/GameProvider';
import { ServersContext } from '../../contexts/ServersProvider';

const PlayServer: React.FC = () => {
  const { serverIp, serverPort } = useParams<{ serverIp: string; serverPort: string }>();
  const { joinServer } = useContext(GameContext);
  const { findServerByIpPort } = useContext(ServersContext);

  const server = useMemo(() => findServerByIpPort(serverIp, Number(serverPort), true), [findServerByIpPort, serverIp, serverPort]);

  useEffect(() => {
    if (!server?.name) return;

    joinServer(server);
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
