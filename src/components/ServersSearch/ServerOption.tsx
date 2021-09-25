import { AutoComplete, Badge, Grid, Spacer, Text } from '@geist-ui/react';
import React from 'react';
import { Server } from '../../types/Types';
import PlayerCount from '../PlayerCount/PlayerCount';

interface Props {
  server: Server;
}

const ServerOption: React.FC<Props> = ({ server }) => {
  return server ? (
    <AutoComplete.Option value={server.id}>
      <Grid.Container className="py-4">
        <Grid xs={24}>
          <Text span b font="1.2rem" className="truncate">
            {server.name}
          </Text>
        </Grid>

        <PlayerCount server={server} type="p" hideTooltip />

        <Badge type="success" style={{ marginLeft: 'auto' }}>
          Recommended
        </Badge>
      </Grid.Container>
    </AutoComplete.Option>
  ) : null;
};

export default ServerOption;
