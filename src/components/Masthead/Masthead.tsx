import { Divider, Spacer, Tag, useTheme } from '@geist-ui/core';
import React from 'react';
import Link from 'next/link';
import Logo from '../Logo/Logo';
import ServersSearch from '../ServersSearch/SeversSearch';

const Masthead: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <div className="container fixed z-20" style={{ background: theme.palette.accents_1 }}>
        <div className="flex items-center h-20 px-8">
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
      </div>
    </>
  );
};

export default Masthead;
