import { Text } from '@geist-ui/core';
import { Server } from '../../types/Types';
import HomeServersCardGroup from './HomeServersCardGroup';

interface Props {
  title: string;
  description: string;
  servers?: Server[];
  isLoading?: boolean;
}

const HomeServersSection: React.FC<Props> = ({ title, description, servers = [], isLoading = false }) => {
  return (
    <>
      <div className="relative flex-auto py-10">
        <div>
          <Text h3 margin={0}>
            {title}
          </Text>
          <Text p type="secondary" className="mb-4 mt-0">
            {description}
          </Text>
        </div>

        <HomeServersCardGroup servers={servers} isLoading={isLoading} />
      </div>
    </>
  );
};

export default HomeServersSection;
