import { AutoComplete, Badge, Grid, Spacer, Text } from '@geist-ui/react';
import { Lock, Map, Users } from '@geist-ui/react-icons';
import React, { useCallback, useContext, useMemo } from 'react';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { Server } from '../../types/Types';
import PlayerCount from '../PlayerCount/PlayerCount';
import Fuse from 'fuse.js';

interface Props {
  result: Fuse.FuseResult<Server>;
}

const ServerOption: React.FC<Props> = ({ result }) => {
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

  return server ? (
    <AutoComplete.Option value={server.id}>
      <Grid.Container className="py-4">
        <Grid xs={24} className="items-center">
          <Text span b font="1.2rem" className="truncate">
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
            <Text p margin={0}>
              {serverIsland?.name}
            </Text>
          </div>
        </Grid>

        <Grid xs={13} className="justify-end space-x-4">
          {matchedName && <Badge type="success">Name</Badge>}

          {matchedIp && <Badge type="success">IP</Badge>}

          {(matchedMods || []).length > 0 && (
            <Badge type="success" className="truncate">
              Mod(s): {matchedMods?.join(', ')}
            </Badge>
          )}
        </Grid>
      </Grid.Container>
    </AutoComplete.Option>
  ) : null;
};

export default ServerOption;
