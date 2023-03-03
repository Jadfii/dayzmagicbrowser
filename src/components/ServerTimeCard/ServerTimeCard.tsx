import { Card, Spacer, Text, Tooltip } from '@geist-ui/core';
import { Clock, Moon, Sun } from '@geist-ui/react-icons';
import React from 'react';
import { Server } from '../../types/Types';
import { getHumanizedTimeDuration, getServerTimeDuration } from '../../utils/time.util';

interface Props {
  server: Server;
}

const ServerTimeCard: React.FC<Props> = ({ server }) => {
  return (
    <Card className="col-span-3 self-start">
      <div className="flex h-16 items-center">
        <Tooltip text="Server time">
          <Clock size={40} />
        </Tooltip>

        <Spacer w={1} />

        <Text h3 margin={0}>
          {server.clockTime}
        </Text>

        <div className="ml-auto flex items-center">
          <Tooltip text="Day time length">
            <Sun />
          </Tooltip>

          <Spacer w={1 / 2} />

          <Text h5 margin={0}>
            {getHumanizedTimeDuration(getServerTimeDuration(server.timeAcceleration)?.day)}
          </Text>
        </div>

        <Spacer w={2} />

        <div className="flex items-center">
          <Tooltip text="Night time length">
            <Moon />
          </Tooltip>

          <Spacer w={1 / 2} />

          <Text h5 margin={0}>
            {getHumanizedTimeDuration(getServerTimeDuration(server.timeAcceleration)?.night)}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default ServerTimeCard;
