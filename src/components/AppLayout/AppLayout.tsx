import React, { PropsWithChildren } from 'react';
import { useTheme } from '@geist-ui/core';
import Masthead from '../Masthead/Masthead';
import Footer from '../Footer/Footer';
import { Inter } from '@next/font/google';

const inter = Inter();

const AppLayout: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const theme = useTheme();

  return (
    <>
      <div className={`w-screen h-full ${inter.className}`}>
        <div className="container relative flex flex-col w-full h-full min-h-screen" style={{ background: theme.palette.accents_1 }}>
          <div className="relative flex flex-col flex-auto min-h-screen">
            <Masthead />

            <div className="relative flex flex-col flex-auto pt-20">{children}</div>
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
