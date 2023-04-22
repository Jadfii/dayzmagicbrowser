import React, { PropsWithChildren } from 'react';
import { useTheme } from '@geist-ui/core';
import Masthead from '../Masthead/Masthead';
import Footer from '../Footer/Footer';
import { Inter } from 'next/font/google';

const font = Inter({ subsets: ['latin'] });

const AppLayout: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const theme = useTheme();

  return (
    <>
      <div className={`h-full w-screen ${font.className}`}>
        <div className="container relative flex h-full min-h-screen w-full flex-col" style={{ background: theme.palette.accents_1 }}>
          <div className="relative flex min-h-screen flex-auto flex-col">
            <Masthead />

            <div className="relative flex flex-auto flex-col pt-20">{children}</div>
          </div>

          <div className="flex">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
