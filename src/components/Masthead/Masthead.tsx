import { Divider, Loading, Spacer, Tag } from '@geist-ui/react';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Logo from '../Logo/Logo';

const ServersSearch = dynamic(() => import('../ServersSearch/SeversSearch'), { suspense: true });

const Masthead: React.FC = () => {
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
          <Suspense fallback={<Loading />}>
            <ServersSearch />
          </Suspense>
        </div>

        <Spacer w={1} />
      </div>

      <Divider margin={0} />
    </>
  );
};

export default Masthead;
