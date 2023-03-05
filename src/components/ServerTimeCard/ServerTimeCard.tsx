import { Card, CardProps, Text, Tooltip } from '@geist-ui/core';
import { Clock, Moon, Sun } from '@geist-ui/react-icons';
import React from 'react';
import { Server } from '../../types/Types';
import { cn } from '../../utils/css.util';
import { getHumanizedTimeDuration, getServerTimeDuration } from '../../utils/time.util';

interface Props extends CardProps {
  server: Server;
}

const ServerTimeCard: React.FC<Props> = ({ server, className, ...rest }) => {
  return (
    <Card {...rest} className={cn('self-start', className)}>
      <div className="flex min-h-[4rem] items-center gap-4">
        <div className="flex items-center gap-x-4">
          <Tooltip text="Server time">
            <Clock size={40} />
          </Tooltip>

          <Text h3 margin={0}>
            {server.clockTime}
          </Text>
        </div>

        <div className="ml-auto flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex items-center gap-2">
            <Tooltip text="Day time length">
              <Sun />
            </Tooltip>

            <Text h5 margin={0}>
              {getHumanizedTimeDuration(getServerTimeDuration(server.timeAcceleration)?.day)}
            </Text>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip text="Night time length">
              <Moon />
            </Tooltip>

            <Text h5 margin={0}>
              {getHumanizedTimeDuration(getServerTimeDuration(server.timeAcceleration)?.night)}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServerTimeCard;
