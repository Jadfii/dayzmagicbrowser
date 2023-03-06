import React from 'react';
import { Server } from '../../types/Types';
import ServerCard from '../ServerCard/ServerCard';
import ServersEmptyState from '../ServersEmptyState/ServersEmptyState';
import { SERVERS_PAGE_SERVERS_COUNT } from '../../constants/layout.constant';

interface Props {
  servers: Server[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

const ServerList: React.FC<Props> = ({ servers, isLoading = false, onResetFilters }) => {
  if (!isLoading && servers.length === 0) return <ServersEmptyState onResetFilters={onResetFilters} />;

  return (
    <div className="grid grid-flow-row grid-cols-1 gap-6 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {!isLoading
        ? servers.map((server) => <ServerCard server={server} imageHeight={100} key={`${server.ipAddress}-${server.gamePort}-card`} />)
        : [...Array(SERVERS_PAGE_SERVERS_COUNT).keys()].map((_, i) => <ServerCard imageHeight={100} isLoading key={i} />)}
    </div>
  );
};

export default ServerList;
