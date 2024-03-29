import { Card, Spacer, Tag, Text } from '@geist-ui/core';
import { ArrowRight } from '@geist-ui/react-icons';
import Link from 'next/link';
import prettyBytes from 'pretty-bytes';
import React from 'react';
import { STEAM_WORKSHOP_ITEM } from '../../constants/links.constant';
import { WorkshopMod } from '../../types/Types';

interface Props {
  mod: WorkshopMod;
}

const ModCard: React.FC<Props> = ({ mod }) => {
  return (
    <Link href={`${STEAM_WORKSHOP_ITEM}${mod.id}`} target="_blank" rel="noreferrer">
      <Card hoverable className="cursor-pointer">
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

          <ArrowRight className="ml-auto flex-shrink-0" />
        </Card.Content>
      </Card>
    </Link>
  );
};

export default ModCard;
