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

interface Props {
  server: Server;
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
      <Link href={`/server/${server.ip}/${server.gamePort}`}>
        <a>
          <Card hoverable className="server-card group">
            {serverIsland?.imageURL && (
              <div className="relative w-full" style={{ height: imageHeight }}>
                <Image
                  alt={`${server?.name} map preview`}
                  layout="fill"
                  loader={({ src }) => src}
                  src={serverIsland?.imageURL}
                  loading="eager"
                  unoptimized
                  className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                />
              </div>
            )}

            <Card.Content>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Tooltip text={server.country}>
                    <div className="relative flex-shrink-0 w-4 h-4">
                      <CountryFlag countryCode={server.countryCode} country={server.country} />
                    </div>
                  </Tooltip>

                  <Spacer w={1 / 2} />

                  <Tooltip text={server.name} className="truncate">
                    <Text h5 width="100%" className="truncate my-0">
                      {server.name.trim()}
                    </Text>
                  </Tooltip>

                  {server.queryPort === server.gamePort + 1 && (
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
        </a>
      </Link>
    </>
  );
};

export default ServerCard;
