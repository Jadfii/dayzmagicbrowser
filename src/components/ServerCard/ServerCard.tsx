import { Badge, Button, Card, Spacer, Text, Tooltip } from '@geist-ui/core';
import { Lock, Play } from '@geist-ui/react-icons';
import React from 'react';
import { Server } from '../../types/Types';
import Image from '../Image/Image';
import Link from 'next/link';
import PlayerCount from '../PlayerCount/PlayerCount';
import Skeleton from '../Skeleton/Skeleton';
import { getIslandImageURL } from '../../constants/links.constant';
import useConnectServer from '../../hooks/useConnectServer';

interface Props {
  server?: Server;
  isLoading?: boolean;
  imageHeight?: number;
}

const ServerCard: React.FC<Props> = ({ server, isLoading = false, imageHeight = 150 }) => {
  const { connectToServer } = useConnectServer(server);

  function onPlayClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!server?.ipAddress) return;

    connectToServer();
  }

  return (
    <>
      <Link href={server?.ipAddress && server?.gamePort ? `/server/${server?.ipAddress}/${server?.gamePort}` : ''}>
        <Card hoverable className="server-card group">
          <div className="relative w-full" style={{ height: imageHeight }}>
            <Image
              isLoading={isLoading}
              maxHeight={imageHeight}
              alt={`${server?.name} map preview`}
              fill
              src={getIslandImageURL(server?.relatedIsland?.terrainId)}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover opacity-40 transition-opacity duration-300 group-hover:opacity-70"
            />
          </div>

          <Card.Content>
            <div className="flex flex-col">
              <div className="flex items-center">
                {server?.name && !isLoading ? (
                  <Tooltip text={server.name} className="truncate">
                    <Text h5 width="100%" className="my-0 truncate">
                      {server.name.trim()}
                    </Text>
                  </Tooltip>
                ) : (
                  <Skeleton rows={1} />
                )}

                {server?.queryPort && server?.gamePort && server?.queryPort === server?.gamePort + 1 && (
                  <>
                    <Spacer w={1 / 2} />
                    <Badge type="success">Playable</Badge>
                  </>
                )}

                {server?.isPassword && (
                  <>
                    <Spacer w={1 / 3} inline />
                    <Tooltip text="Locked">
                      <Lock size={20} />
                    </Tooltip>
                  </>
                )}
              </div>

              <Text small className="my-0">
                {server?.clockTime && !isLoading ? (
                  <>
                    {server?.relatedIsland?.name || server?.island} - {server?.clockTime}
                  </>
                ) : (
                  <>
                    <Spacer h={1 / 2} />

                    <Skeleton cols={3} rows={1} />
                  </>
                )}
              </Text>

              <Spacer h={2} />

              <div className="mt-auto flex items-center justify-between">
                {typeof server?.playerCount !== 'undefined' && server?.ipAddress && !isLoading ? (
                  <PlayerCount server={server} type="h5" />
                ) : (
                  <Skeleton cols={4} rows={1.5} />
                )}

                <Button onClick={onPlayClick} icon={<Play />} disabled={!server?.ipAddress} scale={3 / 4} auto>
                  Play
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </Link>
    </>
  );
};

export default ServerCard;
