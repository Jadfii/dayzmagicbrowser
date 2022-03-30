import { Badge, Button, Card, Spacer, Text, Tooltip } from '@geist-ui/react';
import { Lock, Play } from '@geist-ui/react-icons';
import React from 'react';
import { Server } from '../../types/Types';
import Image from '../Image/Image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PlayerCount from '../PlayerCount/PlayerCount';
import CountryFlag from '../CountryFlag/CountryFlag';
import Skeleton from '../Skeleton/Skeleton';
import { useRecoilValueLoadable } from 'recoil';
import { findIslandByTerrainIdState } from '../../state/islands';
import { getIslandImageURL } from '../../constants/links.constant';

interface Props {
  server?: Server;
  imageHeight?: number;
}

const ServerCard: React.FC<Props> = ({ server, imageHeight = 150 }) => {
  const router = useRouter();
  const serverIsland = useRecoilValueLoadable(findIslandByTerrainIdState(server?.island || ''));

  function onPlayClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!server?.ipAddress) return;

    router.push(`/play/${server.ipAddress}/${server.gamePort}`);
  }

  return (
    <>
      <Link href={server?.ipAddress && server?.gamePort ? `/server/${server?.ipAddress}/${server?.gamePort}` : ''}>
        <a>
          <Card hoverable className="server-card group">
            <div className="relative w-full" style={{ height: imageHeight }}>
              <Image
                isLoading={!server?.island}
                maxHeight={imageHeight}
                alt={`${server?.name} map preview`}
                layout="fill"
                src={getIslandImageURL(serverIsland?.contents?.terrainId)}
                loading="lazy"
                className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-300"
              />
            </div>

            <Card.Content>
              <div className="flex flex-col">
                <div className="flex items-center">
                  {server?.name ? (
                    <Tooltip text={server.name} className="truncate">
                      <Text h5 width="100%" className="truncate my-0">
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
                  {server?.clockTime ? (
                    <>
                      {serverIsland?.contents?.name || server?.island} - {server?.clockTime}
                    </>
                  ) : (
                    <>
                      <Spacer h={1 / 2} />

                      <Skeleton cols={3} rows={1} />
                    </>
                  )}
                </Text>

                <Spacer h={2} />

                <div className="flex items-center justify-between mt-auto">
                  {typeof server?.playerCount !== 'undefined' && server?.ipAddress ? (
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
        </a>
      </Link>
    </>
  );
};

export default ServerCard;
