import React from 'react';
import { Spacer, Text, Tooltip } from '@geist-ui/react';
import { Server } from '../../types/Types';

interface Props {
  server: Server;
  type: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  hideTooltip?: boolean;
}

const PlayerCount: React.FC<Props> = ({ server, type, hideTooltip = false }) => {
  return (
    <>
      <div className="flex items-center">
        <Text {...{ [type]: true }} margin="0">
          {server.players}/{server.maxPlayers}
        </Text>
        <Spacer w={1 / 4} inline />
        {!hideTooltip ? (
          <Tooltip text="Queue">
            <Text {...{ [type]: true }} margin="0">
              {server.queue ? <>(+{server.queue})</> : null}
            </Text>
          </Tooltip>
        ) : (
          <Text {...{ [type]: true }} margin="0">
            {server.queue ? <>(+{server.queue})</> : null}
          </Text>
        )}
      </div>
    </>
  );
};

export default PlayerCount;
