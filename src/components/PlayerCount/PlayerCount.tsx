import React from 'react';
import { Spacer, Text, Tooltip } from '@geist-ui/core';
import { Server } from '../../types/Types';

interface Props {
  server: Server;
  type: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'small';
  hideTooltip?: boolean;
}

const PlayerCount: React.FC<Props> = ({ server, type, hideTooltip = false }) => {
  return (
    <>
      <div className="flex items-center">
        <Text {...{ [type]: true }} margin="0">
          {server.playerCount}/{server.maxPlayerCount}
        </Text>
        <Spacer w={1 / 4} inline />
        {!hideTooltip ? (
          <Tooltip text="Queue">
            <Text {...{ [type]: true }} margin="0">
              {server.queueCount ? <>(+{server.queueCount})</> : null}
            </Text>
          </Tooltip>
        ) : (
          <Text {...{ [type]: true }} margin="0">
            {server.queueCount ? <>(+{server.queueCount})</> : null}
          </Text>
        )}
      </div>
    </>
  );
};

export default PlayerCount;
