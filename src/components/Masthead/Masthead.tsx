import { Button, Divider, Spacer, Tag } from '@geist-ui/react';
import { RefreshCw } from '@geist-ui/react-icons';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../Logo/Logo';
import ServersSearch from '../ServersSearch/SeversSearch';

const Masthead: React.FC = () => {
  const router = useRouter();
  const { serverIp } = router.query;

  function onRefreshClicked() {
    if (serverIp) {
      router.replace(router.asPath);
    }
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

        <Button onClick={onRefreshClicked} icon={<RefreshCw />} style={{ marginLeft: 'auto' }}>
          Refresh servers
        </Button>
      </div>

      <Divider margin={0} />
    </>
  );
};

export default Masthead;
