import React from 'react';
import { Server } from '../../types/Types';
import ServerCard from '../ServerCard/ServerCard';
import ServersEmptyState from '../ServersEmptyState/ServersEmptyState';

const MAX_SERVERS = 250;

interface Props {
  servers: Server[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

const ServerList: React.FC<Props> = ({ servers, isLoading = false, onResetFilters }) => {
  if (!isLoading && servers.length === 0) return <ServersEmptyState onResetFilters={onResetFilters} />;

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-6">
      {!isLoading
        ? servers.slice(0, MAX_SERVERS).map((server, i) => <ServerCard server={server} imageHeight={100} key={i} />)
        : [...Array(MAX_SERVERS).keys()].map((_, i) => <ServerCard imageHeight={100} isLoading key={i} />)}
    </div>
  );
};

export default ServerList;
