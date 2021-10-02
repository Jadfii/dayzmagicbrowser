import { Button, Card, Image, Spacer, Text, Tooltip } from '@geist-ui/react';
import { Lock, Play } from '@geist-ui/react-icons';
import React, { useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { GameContext } from '../../contexts/GameProvider';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { Server } from '../../types/Types';
import PlayerCount from '../PlayerCount/PlayerCount';

interface Props {
  server: Server;
}

const ServerCard: React.FC<Props> = ({ server }) => {
  const history = useHistory();
  const { getIslandByTerrain } = useContext(IslandsContext);
  const { joinServer } = useContext(GameContext);

  const serverIsland = useMemo(() => getIslandByTerrain(server?.island || ''), [getIslandByTerrain, server?.island]);

  function onClick() {
    if (!server?.ip) return;

    history.push(`/server/${server.ip}/${server.queryPort}`);
  }

  function onPlayClick(e) {
    e.stopPropagation();
    if (!server?.ip) return;

    joinServer(server);
  }

  return (
    <Card onClick={onClick} hoverable className="cursor-pointer">
      <Image height="150px" src={serverIsland?.imageURL || ''} style={{ objectFit: 'cover', opacity: 0.4 }} />

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
          {serverIsland?.name || server.island} - {server.time}
        </Text>

        <Spacer h={2} />

        <div className="flex justify-between mt-auto">
          <PlayerCount server={server} type="h5" />

          <Button onClick={onPlayClick} icon={<Play />} scale={3 / 4} auto>
            Play
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ServerCard;
