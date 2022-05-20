import { HOME_SECTION_SERVERS_COUNT } from '../../constants/layout.constant';
import { Server } from '../../types/Types';
import ServerCard from '../ServerCard/ServerCard';
import ServersEmptyState from '../ServersEmptyState/ServersEmptyState';

interface Props {
  servers: Server[];
  isLoading: boolean;
}

const HomeServersCardGroup: React.FC<Props> = ({ servers, isLoading }) => {
  if (isLoading)
    return (
      <>
        {[...Array(HOME_SECTION_SERVERS_COUNT).keys()].map((_, i) => (
          <ServerCard imageHeight={100} key={i} />
        ))}
      </>
    );

  if (servers.length === 0)
    return (
      <>
        <ServersEmptyState dim />
      </>
    );

  return (
    <>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-flow-row gap-6">
        {servers.map((server, i) => (
          <ServerCard server={server} key={i} />
        ))}
      </div>
    </>
  );
};

export default HomeServersCardGroup;
