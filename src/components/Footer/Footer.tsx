import { Link, Spacer, Text, useTheme } from '@geist-ui/core';
import React from 'react';
import Logo from '../Logo/Logo';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <div className="flex w-full pt-12 py-24 mt-auto" style={{ background: theme.palette.background }}>
      <div>
        <Logo />

        <Spacer h={1 / 2} />

        <div className="max-w-sm">
          <Text small type="secondary">
            MagicLauncher is in no way affiliated with DayZ or Bohemia Interactive a.s.
          </Text>

          <Spacer h={1} />

          <Text small type="secondary">
            &copy; {new Date().getFullYear()} MagicLauncher. All rights reserved.
          </Text>
        </div>
      </div>

      <div className="ml-auto">
        <Text small>
          Made by{' '}
          <Link href="//github.com/Jadfii" target="_blank" underline>
            Jad
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default Footer;
