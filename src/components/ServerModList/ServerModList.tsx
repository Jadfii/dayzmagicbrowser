import { Card, Loading, Text } from '@geist-ui/react';
import React from 'react';
import { WorkshopMod } from '../../types/Types';
import ModCard from './ModCard';

interface Props {
  mods: WorkshopMod[];
  isLoading?: boolean;
}

const ServerModList: React.FC<Props> = ({ mods, isLoading }) => {
  return (
    <div className="flex flex-col flex-auto">
      <Text h3>Mods</Text>
      <Card className="flex flex-auto">
        <Card.Content className="flex flex-col flex-auto">
          <div className="flex flex-col flex-auto">
            <div className="flex flex-col flex-auto h-0 overflow-y-auto">
              {isLoading ? (
                <Loading>Loading mods...</Loading>
              ) : (
                <>
                  {mods.length > 0 ? (
                    <div className="grid grid-cols-1 grid-flow-row gap-2 pr-2">
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
