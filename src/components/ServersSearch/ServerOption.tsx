import { AutoComplete, Badge, Grid, Spacer, Text, useTheme } from '@geist-ui/react';
import { Lock, Map, Users } from '@geist-ui/react-icons';
import React, { useCallback, useContext, useMemo } from 'react';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { Server } from '../../types/Types';
import PlayerCount from '../PlayerCount/PlayerCount';
import Fuse from 'fuse.js';
import Link from 'next/link';

interface Props {
  result: Fuse.FuseResult<Server>;
  handleClick?: () => void;
}

const ServerOption: React.FC<Props> = ({ result, handleClick }) => {
  const theme = useTheme();
  const { getIslandByTerrain } = useContext(IslandsContext);

  const server = useMemo(() => result?.item, [result]);
  const serverIsland = useMemo(() => getIslandByTerrain(server?.island || ''), [getIslandByTerrain, server]);

  const getMatchedValue = useCallback((key: string) => result?.matches?.find((match) => match.key === key)?.value, [result?.matches]);
  const getMatchedValues = useCallback(
    (key: string) => result?.matches?.filter((match) => match.key === key).map((match) => match.value),
    [result?.matches]
  );

  const matchedName = useMemo(() => getMatchedValue('name'), [getMatchedValue]);
  const matchedIp = useMemo(() => getMatchedValue('ip'), [getMatchedValue]);
  const matchedMods = useMemo(() => getMatchedValues('mods.name'), [getMatchedValues]);

  function onClick() {
    if (!server?.ip) return;

    if (handleClick) handleClick();
  }

  return server ? (
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

              <Grid xs={12} className="justify-end space-x-4" style={{ marginLeft: 'auto' }}>
                {matchedName && <Badge type="success">Name</Badge>}

                {matchedIp && <Badge type="success">IP address</Badge>}

                {(matchedMods || []).length > 0 && (
                  <Badge type="success" className="truncate">
                    Mod(s): {matchedMods?.join(', ')}
                  </Badge>
                )}
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
