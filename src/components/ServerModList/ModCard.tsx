import { Card, Text } from '@geist-ui/react';
import React from 'react';
import { STEAM_WORKSHOP_ITEM } from '../../constants/links.constant';
import { WorkshopMod } from '../../types/Types';

interface Props {
  mod: WorkshopMod;
}

const ModCard: React.FC<Props> = ({ mod }) => {
  return (
    <Card hoverable onClick={() => window.open(`${STEAM_WORKSHOP_ITEM}${mod.id}`, '_blank')} className="cursor-pointer">
      <Text h6>{mod.name}</Text>
      <Text small>{mod.subscriptions.toLocaleString()} subscribers</Text>
    </Card>
  );
};

export default ModCard;
