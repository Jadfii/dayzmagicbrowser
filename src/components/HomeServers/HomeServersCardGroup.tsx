import { HOME_SECTION_SERVERS_COUNT } from '../../constants/layout.constant';
import { Server } from '../../types/Types';
import ServerCard from '../ServerCard/ServerCard';
import ServersEmptyState from '../ServersEmptyState/ServersEmptyState';

interface Props {
  servers: Server[];
  isLoading: boolean;
}

const HomeServersCardGroup: React.FC<Props> = ({ servers, isLoading }) => {
  if (servers.length === 0)
    return (
      <>
        <ServersEmptyState dim />
      </>
    );

  return (
    <>
      <div className="relative grid grid-flow-row grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading && [...Array(HOME_SECTION_SERVERS_COUNT).keys()].map((_, i) => <ServerCard imageHeight={100} key={i} />)}

        {!isLoading && servers.map((server) => <ServerCard server={server} key={`${server.ipAddress}-${server.gamePort}-card`} />)}
      </div>
    </>
  );
};

export default HomeServersCardGroup;
