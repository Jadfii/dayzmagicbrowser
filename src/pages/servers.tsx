import { Button, Loading, Spacer, Text } from '@geist-ui/core';
import React from 'react';
import { InferGetStaticPropsType } from 'next';
import ServerList from '../components/ServerList/ServerList';
import { NextSeo } from 'next-seo';
import ServerFilters from '../components/ServerFilters/ServerFilters';
import { Delete } from '@geist-ui/react-icons';
import { useRouter } from 'next/router';
import useServers from '../hooks/useServers';
import useServerFilters from '../hooks/useServerFilters';
import { getServersPageData } from './api/servers';

export const getStaticProps = async () => {
  const servers = await getServersPageData();

  return {
    revalidate: 600,
    props: {
      servers: servers,
    },
  };
};

const Servers: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ servers }) => {
  const router = useRouter();

  const filters = useServerFilters();
  const { serverList, isValidating } = useServers(servers);

  function resetFilters() {
    router.push({ query: {} });
  }

  return (
    <>
      <NextSeo title="Servers" />

      <div className="relative flex flex-col flex-1 py-10">
        <div className="flex items-center justify-between w-44">
          <Text h2>Servers</Text>
          {isValidating && <Loading></Loading>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button onClick={resetFilters} icon={<Delete />} auto>
                Reset filters
              </Button>
            </div>

            <Text p margin={0}>
              Showing {serverList.length} servers
            </Text>
          </div>

          <ServerFilters filters={filters} />
        </div>

        <Spacer h={1} />

        <ServerList servers={serverList} isLoading={false} onResetFilters={resetFilters} />
      </div>
    </>
  );
};

export default Servers;
