import { Card, Tooltip } from '@geist-ui/core';
import React from 'react';
import { cn } from '../../utils/css.util';

interface Props extends React.HTMLProps<HTMLDivElement> {
  icon: React.ReactElement;
  iconDescription: string;
  item: React.ReactNode;
}

const ServerInfoCard: React.FC<Props> = ({ icon, iconDescription, item, className }) => {
  return (
    <Card className={cn('self-start', className)}>
      <div className="flex min-h-[4rem] items-center gap-x-4">
        <Tooltip text={iconDescription}>{React.cloneElement(icon, { size: 40 })}</Tooltip>

        {item}
      </div>
    </Card>
  );
};

export default ServerInfoCard;
