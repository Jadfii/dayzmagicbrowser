import React, { useContext } from 'react';
import { Button, Spacer, Table, Text } from '@geist-ui/react';
import { ServersContext } from '../../contexts/ServersProvider';
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import { Server } from '../../types/Types';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { Lock, Play } from '@geist-ui/react-icons';
import { GameContext } from '../../contexts/GameProvider';

const PlayerCountRow: TableColumnRender<Server> = (value, server) => {
  return (
    <div className="flex items-center">
      <Text p margin={0}>
        {server.players}/{server.maxPlayers}
      </Text>

      <Spacer w={1 / 4} inline />

      <Text p margin={0}>
        {server.queue ? <>(+{server.queue})</> : null}
      </Text>
    </div>
  );
};

const MapRow: TableColumnRender<Server> = (value, server) => {
  const { getIslandByTerrain } = useContext(IslandsContext);

  return <Text p>{getIslandByTerrain(server?.island)?.name || server?.island || ''}</Text>;
};

const ActionsRow: TableColumnRender<Server> = (value, server) => {
  const { joinServer } = useContext(GameContext);

  function onClick(e) {
    e.stopPropagation();
    if (!server?.ip) return;
    joinServer(server);
  }

  return (
    <>
      <Button onClick={onClick} icon={server?.hasPassword ? <Lock /> : <Play />} auto>
        Play
      </Button>
    </>
  );
};

const ServerList: React.FC = () => {
  const { servers } = useContext(ServersContext);

  return (
    <>
      <Table<Server> data={servers.slice(0, 500)} emptyText="No servers found.">
        <Table.Column<Server> prop="name" label="Name" />
        <Table.Column<Server> prop="island" label="Map" render={MapRow} />
        <Table.Column<Server> prop="players" label="Players" render={PlayerCountRow} />
        <Table.Column<Server> prop="id" label="" render={ActionsRow} />
      </Table>
    </>
  );
};

export default ServerList;
