import { Text } from '@geist-ui/react';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ServerList from '../../components/ServerList/ServerList';
import { TITLE_PREFIX } from '../../constants/meta.constant';

const Servers: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{TITLE_PREFIX} - Servers</title>
      </Helmet>

      <div className="relative flex flex-col flex-1 py-10">
        <Text h2>Servers</Text>
        <ServerList />
      </div>
    </>
  );
};

export default Servers;
