import { Badge, Button, Card, Spacer, Text, Tooltip } from '@geist-ui/react';
import { Lock, Play } from '@geist-ui/react-icons';
import React, { useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { Server } from '../../types/Types';
import Image from '../Image/Image';
import PlayerCount from '../PlayerCount/PlayerCount';
import './server-card.scss';

interface Props {
  server: Server;
  imageHeight?: number;
}

const ServerCard: React.FC<Props> = ({ server, imageHeight = 150 }) => {
  const history = useHistory();
  const { getIslandByTerrain } = useContext(IslandsContext);

  const serverIsland = useMemo(() => getIslandByTerrain(server?.island || ''), [getIslandByTerrain, server?.island]);

  function onClick() {
    if (!server?.ip) return;

    history.push(`/server/${server.ip}/${server.queryPort}`);
  }

  function onPlayClick(e) {
    e.stopPropagation();
    if (!server?.ip) return;

    history.push(`/play/${server.ip}/${server.queryPort}`);
  }

  return (
    <Card onClick={onClick} hoverable className="server-card cursor-pointer">
      <Image height={`${imageHeight}px`} src={serverIsland?.imageURL || ''} style={{ objectFit: 'cover' }} />

      <Card.Content>
        <div className="flex flex-col">
          <div className="flex items-center">
            <Text h5 className="truncate my-0">
              {server.name}
            </Text>

            {import.meta.env.DEV && server.queryPort === server.gamePort + 1 && (
              <>
                <Spacer w={1 / 2} />
                <Badge type="success">Playable</Badge>
              </>
            )}

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
      </Card.Content>
    </Card>
  );
};

export default ServerCard;
