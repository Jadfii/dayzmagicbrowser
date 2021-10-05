import { Card, Spacer, Tooltip } from '@geist-ui/react';
import React from 'react';

interface Props extends React.HTMLProps<HTMLDivElement> {
  icon: React.ReactElement;
  iconDescription: string;
  item: React.ReactNode;
}

const InfoCard: React.FC<Props> = ({ icon, iconDescription, item, className }) => {
  return (
    <Card className={`self-start ${className}`}>
      <div className="flex items-center h-16">
        <Tooltip text={iconDescription}>{React.cloneElement(icon, { size: 40 })}</Tooltip>

        <Spacer w={1} />

        {item}
      </div>
    </Card>
  );
};

export default InfoCard;
