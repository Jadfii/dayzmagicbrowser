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
        <div className="flex h-20 items-center px-8">
          <Link href="/" className="flex items-center">
            <Logo className="text-white" />

            <Spacer w={1 / 2} />

            <Tag type="lite">ALPHA</Tag>
          </Link>

          <div className="ml-6 hidden w-full sm:block lg:w-[40%]">
            <ServersSearch />
          </div>
        </div>

        <Divider margin={0} />
      </div>
    </>
  );
};

export default Masthead;
