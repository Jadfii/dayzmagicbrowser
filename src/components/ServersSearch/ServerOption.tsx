import { Grid, Spacer, Text, useTheme } from '@geist-ui/core';
import { Lock, Map, Users } from '@geist-ui/react-icons';
import React from 'react';
import { Server } from '../../types/Types';
import PlayerCount from '../PlayerCount/PlayerCount';
import Link from 'next/link';

interface Props {
  server: Server;
  handleClick?: () => void;
}

const ServerOption: React.FC<Props> = ({ server, handleClick }) => {
  const theme = useTheme();

  function onClick() {
    if (!server?.ipAddress) return;

    if (handleClick) handleClick();
  }

  return server?.name ? (
    <>
      <Link href={`/server/${server.ipAddress}/${server.gamePort}`} className="w-full" style={{ color: theme.palette.foreground }} prefetch={false}>
        <Grid.Container className="py-4" onClick={onClick}>
          <Grid xs={24} className="items-center">
            <Text h4 className="truncate">
              {server.name}
            </Text>

            {server.isPassword && (
              <>
                <Spacer w={1 / 3} />
                <Lock size={20} />
              </>
            )}
          </Grid>

          <Grid xs={6}>
            <div className="flex items-center">
              <Users size={16} />
              <Spacer w={1 / 3} />
              <PlayerCount server={server} type="p" hideTooltip />
            </div>
          </Grid>

          <Grid xs={5}>
            <div className="flex items-center">
              <Map size={16} />
              <Spacer w={1 / 3} />
              <Text p margin={0} className="truncate">
                {server?.relatedIsland?.name || server.island}
              </Text>
            </div>
          </Grid>
        </Grid.Container>
      </Link>
    </>
  ) : (
    <></>
  );
};

export default ServerOption;
