import { AutoComplete, Grid, Spacer, Text, useTheme } from '@geist-ui/react';
import { Lock, Map, Users } from '@geist-ui/react-icons';
import React, { useContext, useMemo } from 'react';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { Server } from '../../types/Types';
import PlayerCount from '../PlayerCount/PlayerCount';
import Link from 'next/link';

interface Props {
  server: Server;
  handleClick?: () => void;
}

const ServerOption: React.FC<Props> = ({ server, handleClick }) => {
  const theme = useTheme();
  const { getIslandByTerrain } = useContext(IslandsContext);

  const serverIsland = useMemo(() => getIslandByTerrain(server?.island || ''), [getIslandByTerrain, server]);

  function onClick() {
    if (!server?.ip) return;

    if (handleClick) handleClick();
  }

  return server?.name ? (
    <>
      <AutoComplete.Item value={server.id}>
        <Link href={`/server/${server.ip}/${server.gamePort}`}>
          <a className="server-option">
            <Grid.Container className="py-4" onClick={onClick}>
              <Grid xs={24} className="items-center">
                <Text h4 className="truncate">
                  {server.name}
                </Text>

                {server.hasPassword && (
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
                    {serverIsland?.name || server.island}
                  </Text>
                </div>
              </Grid>
            </Grid.Container>
          </a>
        </Link>
      </AutoComplete.Item>

      <style jsx>{`
        .server-option {
          width: 100%;
          color: ${theme.palette.foreground};
        }
      `}</style>
    </>
  ) : null;
};

export default ServerOption;
