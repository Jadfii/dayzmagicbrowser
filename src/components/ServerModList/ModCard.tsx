import { Card, Text } from '@geist-ui/react';
import { ArrowRight } from '@geist-ui/react-icons';
import React from 'react';
import { STEAM_WORKSHOP_ITEM } from '../../constants/links.constant';
import { WorkshopMod } from '../../types/Types';

interface Props {
  mod: WorkshopMod;
}

const ModCard: React.FC<Props> = ({ mod }) => {
  return (
    <Card hoverable onClick={() => window.open(`${STEAM_WORKSHOP_ITEM}${mod.id}`, '_blank')} className="cursor-pointer">
      <Card.Content className="flex items-center">
        <div>
          {mod.name && (
            <Text h6 margin={0}>
              {mod.name}
            </Text>
          )}
          {mod.subscriptions && <Text small>{mod.subscriptions.toLocaleString()} subscribers</Text>}
        </div>

        <ArrowRight className="ml-auto" />
      </Card.Content>
    </Card>
  );
};

export default ModCard;
