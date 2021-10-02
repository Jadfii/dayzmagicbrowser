import { Grid } from '@geist-ui/react';
import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ServersContext } from '../../contexts/ServersProvider';
import { Server } from '../../types/Types';

const ServerPage: React.FC = () => {
  const { serverIp, serverPort } = useParams<{ serverIp: string; serverPort: string }>();
  const { servers, findServerByIpPort } = useContext(ServersContext);

  const server: Server | undefined = useMemo(
    () => (servers.length > 0 ? findServerByIpPort(serverIp, Number(serverPort), true) : undefined),
    [servers, serverIp, serverPort]
  );

  return (
    <div className="relative flex items-center flex-auto h-full">
      <Grid.Container gap={2}>
        <Grid xs={24}>
          <h1>{server?.name}</h1>
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default ServerPage;
