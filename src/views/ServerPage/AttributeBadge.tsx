import { Badge, Spacer } from '@geist-ui/react';
import { BadgeTypes } from '@geist-ui/react/dist/badge/badge';
import React from 'react';

interface Props {
  icon: React.ReactElement;
  label: string;
  type?: BadgeTypes;
}

const AttributeBadge: React.FC<Props> = ({ icon, label, type = 'default' }) => {
  return (
    <Badge type={type}>
      <div className="flex items-center">
        {React.cloneElement(icon, { size: 20 })}

        <Spacer w={1 / 4} />

        <>{label}</>
      </div>
    </Badge>
  );
};

export default AttributeBadge;
