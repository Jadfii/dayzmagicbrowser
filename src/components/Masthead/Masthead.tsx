import { Button, Spacer } from '@geist-ui/react';
import { RefreshCw } from '@geist-ui/react-icons';
import React, { useContext } from 'react';
import { ServersContext } from '../../contexts/ServersProvider';
import ServersSearch from '../ServersSearch/SeversSearch';

const Masthead: React.FC = () => {
  const { refreshServers } = useContext(ServersContext);

  return (
    <div className="flex items-center justify-center w-full py-4">
      <ServersSearch />

      <Spacer w={1} />

      <Button onClick={() => refreshServers()} icon={<RefreshCw />}>
        Refresh servers
      </Button>
    </div>
  );
};

export default Masthead;
