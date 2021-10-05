import { Card, Spacer, Text, Tooltip } from '@geist-ui/react';
import { Clock, Moon, Sun } from '@geist-ui/react-icons';
import React from 'react';
import { Server } from '../../types/Types';
import { getHumanizedTimeDuration } from '../../utils/time.util';

interface Props {
  server: Server;
}

const ServerTimeCard: React.FC<Props> = ({ server }) => {
  return (
    <Card className="self-start col-span-3">
      <div className="flex items-center h-16">
        <Tooltip text="Server time">
          <Clock size={40} />
        </Tooltip>

        <Spacer w={1} />

        <Text h3 margin={0}>
          {server.time}
        </Text>

        <div className="flex items-center ml-auto">
          <Tooltip text="Day time length">
            <Sun />
          </Tooltip>

          <Spacer w={1 / 2} />

          <Text h5 margin={0}>
            {getHumanizedTimeDuration(server.timeDuration.day)}
          </Text>
        </div>

        <Spacer w={2} />

        <div className="flex items-center">
          <Tooltip text="Night time length">
            <Moon />
          </Tooltip>

          <Spacer w={1 / 2} />

          <Text h5 margin={0}>
            {getHumanizedTimeDuration(server.timeDuration.night)}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default ServerTimeCard;
