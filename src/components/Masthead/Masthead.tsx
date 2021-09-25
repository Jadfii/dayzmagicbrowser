import { Button, Spacer } from '@geist-ui/react';
import { RefreshCw } from '@geist-ui/react-icons';
import React, { useContext } from 'react';
import { ServersContext } from '../../contexts/ServersProvider';
import Logo from '../Logo/Logo';
import ServersSearch from '../ServersSearch/SeversSearch';

const Masthead: React.FC = () => {
  const { refreshServers, isLoadingServers } = useContext(ServersContext);

  return (
    <div className="flex items-center py-4">
      <Logo />

      <div className="ml-6" style={{ width: '40%' }}>
        <ServersSearch />
      </div>

      <Spacer w={1} />

      <Button onClick={() => refreshServers()} icon={<RefreshCw />} loading={isLoadingServers} marginLeft="auto">
        Refresh servers
      </Button>
    </div>
  );
};

export default Masthead;
