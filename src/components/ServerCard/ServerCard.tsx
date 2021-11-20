import { Badge, Button, Card, Spacer, Text, Tooltip } from '@geist-ui/react';
import { Lock, Play } from '@geist-ui/react-icons';
import React, { useContext, useMemo } from 'react';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { Server } from '../../types/Types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PlayerCount from '../PlayerCount/PlayerCount';
import CountryFlag from '../CountryFlag/CountryFlag';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import Skeleton from '../Skeleton/Skeleton';

interface Props {
  server?: Server;
  imageHeight?: number;
}

const ServerCard: React.FC<Props> = ({ server, imageHeight = 150 }) => {
  const router = useRouter();
  const { getIslandByTerrain } = useContext(IslandsContext);

  const serverIsland = useMemo(() => getIslandByTerrain(server?.island || ''), [getIslandByTerrain, server?.island]);

  function onPlayClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!server?.ip) return;

    router.push(`/play/${server.ip}/${server.gamePort}`);
  }

  return (
    <>
      <Link href={server?.ip && server?.gamePort ? `/server/${server?.ip}/${server?.gamePort}` : ''}>
        <a>
          <Card hoverable className="server-card group">
            <div className="relative w-full" style={{ height: imageHeight }}>
              {server?.island ? (
                serverIsland?.imageURL ? (
                  <Image
                    alt={`${server?.name} map preview`}
                    layout="fill"
                    src={serverIsland?.imageURL}
                    loading="lazy"
                    className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                    loader={({ src }) => src}
                    unoptimized
                  />
                ) : (
                  <ImagePlaceholder />
                )
              ) : (
                <>
                  <Skeleton />
                </>
              )}
            </div>

            <Card.Content>
              <div className="flex flex-col">
                <div className="flex items-center">
                  {server?.geo.countryCode && (
                    <>
                      <Tooltip text={server.geo.country}>
                        <div className="relative flex-shrink-0 w-4 h-4">
                          <CountryFlag countryCode={server.geo.countryCode} country={server.geo.country} />
                        </div>
                      </Tooltip>

                      <Spacer w={1 / 2} />
                    </>
                  )}

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

                  {server?.hasPassword && (
                    <>
                      <Spacer w={1 / 3} inline />
                      <Tooltip text="Locked">
                        <Lock size={20} />
                      </Tooltip>
                    </>
                  )}
                </div>

                <Text small className="my-0">
                  {server?.time ? (
                    <>
                      {serverIsland?.name || server?.island} - {server?.time}
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
                  {typeof server?.players !== 'undefined' && server?.ip ? (
                    <PlayerCount server={server} type="h5" />
                  ) : (
                    <Skeleton cols={4} rows={1.5} />
                  )}

                  <Button onClick={onPlayClick} icon={<Play />} disabled={!server?.ip} scale={3 / 4} auto>
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
