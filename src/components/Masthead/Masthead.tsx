import { Divider, Spacer, Tag } from '@geist-ui/react';
import React from 'react';
import Link from 'next/link';
import Logo from '../Logo/Logo';
import ServersSearch from '../ServersSearch/SeversSearch';

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
          <ServersSearch />
        </div>

        <Spacer w={1} />
      </div>

      <Divider margin={0} />
    </>
  );
};

export default Masthead;
