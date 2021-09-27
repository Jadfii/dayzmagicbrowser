import { Card, Image, Spacer, Text, Tooltip } from '@geist-ui/react';
import { Lock } from '@geist-ui/react-icons';
import React, { useContext, useMemo } from 'react';
import { IMAGE_BUCKET } from '../../constants/links.constant';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { Server } from '../../types/Types';
import { formatIsland } from '../../utils/server.util';
import PlayerCount from '../PlayerCount/PlayerCount';

interface Props {
  server: Server;
}

const ServerCard: React.FC<Props> = ({ server }) => {
  const { getIslandByTerrain } = useContext(IslandsContext);

  const islandSrc = useMemo(() => {
    return `${IMAGE_BUCKET}${formatIsland(server.island)}.jpg`;
  }, [server?.island]);

  return (
    <Card onClick={() => console.log(server)} hoverable className="cursor-pointer">
      <Image src={islandSrc} style={{ opacity: 0.4 }} />

      <div className="flex flex-col">
        <div className="flex items-center">
          <Text h5 className="truncate my-0">
            {server.name}
          </Text>

          {server.hasPassword && (
            <>
              <Spacer w={1 / 3} inline />
              <Tooltip text="Locked">
                <Lock size={20} />
              </Tooltip>
            </>
          )}
        </div>

        <Text small className="my-0">
          {getIslandByTerrain(server.island)?.name || server.island} - {server.time}
        </Text>

        <Spacer h={2} />

        <div className="mt-auto">
          <PlayerCount server={server} type="h5" />
        </div>
      </div>
    </Card>
  );
};

export default ServerCard;
