import React from 'react';
import './app-layout.scss';
import { useTheme } from '@geist-ui/react';
import Masthead from '../Masthead/Masthead';
import Routes from '../../routes/Routes';
import Footer from '../Footer/Footer';

const AppLayout = () => {
  const theme = useTheme();

  return (
    <>
      <div className="w-screen h-full">
        <div className="container relative flex flex-col w-full h-full min-h-screen" style={{ background: theme.palette.accents_1 }}>
          <div className="flex flex-col flex-auto min-h-screen">
            <Masthead />
            <Routes />
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
