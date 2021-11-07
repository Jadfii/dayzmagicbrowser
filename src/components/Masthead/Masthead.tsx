import { Button, Divider, Spacer, Tag } from '@geist-ui/react';
import { RefreshCw } from '@geist-ui/react-icons';
import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ServersContext } from '../../contexts/ServersProvider';
import Logo from '../Logo/Logo';
import ServersSearch from '../ServersSearch/SeversSearch';

const Masthead: React.FC = () => {
  const router = useRouter();
  const { serverIp } = router.query;
  const { refreshServers, isLoadingServers } = useContext(ServersContext);

  function onRefreshClicked() {
    if (serverIp) {
      router.replace(router.asPath);
    }

    refreshServers();
  }

  return (
    <>
      <div className="flex items-center py-4">
        <Link href="/">
          <a className="flex items-center">
            <Logo style={{ color: '#fff' }} />

            <Spacer w={1 / 2} />

            <Tag type="lite">ALPHA</Tag>
          </a>
        </Link>

        <div className="ml-6" style={{ width: '40%' }}>
          <ServersSearch />
        </div>

        <Spacer w={1} />

        <Button onClick={onRefreshClicked} icon={<RefreshCw />} loading={isLoadingServers} style={{ marginLeft: 'auto' }}>
          Refresh servers
        </Button>
      </div>

      <Divider margin={0} />
    </>
  );
};

export default Masthead;
