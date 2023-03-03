import { Card, Loading, Text } from '@geist-ui/core';
import React from 'react';
import { WorkshopMod } from '../../types/Types';
import ModCard from './ModCard';

interface Props {
  mods: WorkshopMod[];
  isLoading?: boolean;
}

const ServerModList: React.FC<Props> = ({ mods, isLoading }) => {
  return (
    <div className="flex flex-auto flex-col">
      <Text h3>Mods</Text>
      <Card className="flex flex-auto">
        <Card.Content className="flex flex-auto flex-col">
          <div className="flex flex-auto flex-col">
            <div className="flex h-0 flex-auto flex-col overflow-y-auto">
              {isLoading ? (
                <Loading>Loading mods...</Loading>
              ) : (
                <>
                  {mods.length > 0 ? (
                    <div className="grid grid-flow-row grid-cols-1 gap-2 pr-2">
                      {mods.map((mod, i) => (
                        <ModCard mod={mod} key={i} />
                      ))}
                    </div>
                  ) : (
                    <>
                      <Text p margin={0}>
                        This server has no mods.
                      </Text>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ServerModList;
