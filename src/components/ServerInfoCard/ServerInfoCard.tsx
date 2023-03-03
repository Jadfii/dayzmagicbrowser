import { Card, Spacer, Tooltip } from '@geist-ui/core';
import React from 'react';

interface Props extends React.HTMLProps<HTMLDivElement> {
  icon: React.ReactElement;
  iconDescription: string;
  item: React.ReactNode;
}

const ServerInfoCard: React.FC<Props> = ({ icon, iconDescription, item, className }) => {
  return (
    <Card className={`self-start ${className}`}>
      <div className="flex h-16 items-center">
        <Tooltip text={iconDescription}>{React.cloneElement(icon, { size: 40 })}</Tooltip>

        <Spacer w={1} />

        {item}
      </div>
    </Card>
  );
};

export default ServerInfoCard;
