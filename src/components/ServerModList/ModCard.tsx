import { Card, Spacer, Tag, Text } from '@geist-ui/react';
import { ArrowRight } from '@geist-ui/react-icons';
import prettyBytes from 'pretty-bytes';
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
          {!mod?.success && (
            <>
              <Tag type="warning" className="flex-shrink-0">
                Unknown mod
              </Tag>

              <Spacer h={1 / 4} />
            </>
          )}

          {mod.name && (
            <Text h6 margin={0} className="flex-shrink-1">
              {mod.name}
            </Text>
          )}

          <div className="flex flex-col">
            {mod.fileSize && <Text small>{prettyBytes(mod.fileSize)}</Text>}
            {mod.subscriptions && <Text small>{mod.subscriptions.toLocaleString()} subscribers</Text>}
          </div>
        </div>

        <ArrowRight className="flex-shrink-0 ml-auto" />
      </Card.Content>
    </Card>
  );
};

export default ModCard;
