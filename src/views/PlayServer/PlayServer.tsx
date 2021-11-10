import { Text } from '@geist-ui/react';
import React, { useContext, useEffect } from 'react';
import { GameContext } from '../../contexts/GameProvider';
import { Server } from '../../types/Types';

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
