import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Button, Grid, Loading, Spacer, Text, Tooltip, useTheme } from '@geist-ui/core';
import { Check, Lock, Map, Shield, ShieldOff, User, Users, Tag, Play, Tool, DollarSign, AlertTriangle } from '@geist-ui/react-icons';
import { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import BackgroundImage from '../../../components/BackgroundImage/BackgroundImage';
import PlayerCount from '../../../components/PlayerCount/PlayerCount';
import ServerModList from '../../../components/ServerModList/ServerModList';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import ServerFeatureBadge from '../../../components/ServerFeatureBadge/ServerFeatureBadge';
import ServerInfoCard from '../../../components/ServerInfoCard/ServerInfoCard';
import ServerTimeCard from '../../../components/ServerTimeCard/ServerTimeCard';
import { getIslandImageURL } from '../../../constants/links.constant';
import { isMatchingVersion } from '../../../data/Version';
import useDayzVersion from '../../../hooks/data/useDayzVersion';
import useWorkshopMods from '../../../hooks/data/useWorkshopMods';
import useConnectServer from '../../../hooks/useConnectServer';
import useCurrentServer from '../../../hooks/data/useCurrentServer';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Endpoint } from '../../../types/Endpoints';
import { getServerPageData } from '../../api/servers/[serverIp]/[serverPort]';

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  if (!params?.serverIp || !params?.serverPort) {
    return {
      notFound: true,
    };
  }

  const server = await getServerPageData(String(params?.serverIp), Number(params?.serverPort));

  if (!server?.ipAddress) {
    return {
      notFound: true,
    };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`${Endpoint.SERVERS}/${params.serverIp}/${params.serverPort}`], () => server);

  // Caching
  res.setHeader('Cache-Control', `s-maxage=60, stale-while-revalidate`);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const ServerPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const theme = useTheme();

  const { data: server, isFetching: isLoadingServer } = useCurrentServer();
  const { data: dayzVersion } = useDayzVersion();
  const { data: workshopMods, isInitialLoading: isLoadingMods } = useWorkshopMods(server?.modIds?.map(String) || []);

  const { connectToServer } = useConnectServer(server);

  const isExperimental = server?.appId === DAYZ_EXP_APPID;
  const isLatestGameVersion =
    !!server?.version &&
    !!dayzVersion?.stable &&
    !!dayzVersion?.exp &&
    isMatchingVersion(server?.version, isExperimental ? dayzVersion?.exp : dayzVersion?.stable);

  function onPlayClick() {
    connectToServer();
  }

  useEffect(() => {
    if (!server?.ipAddress) {
      return;
    }

    console.log(server);
  }, [server]);

  return (
    <>
      <NextSeo
        title={server?.name}
        description={`View information about server "${server?.name}".`}
        openGraph={{
          images: [
            {
              url: `https://browser.dayzmagiclauncher.com/api/og?serverIp=${server?.ipAddress}&serverPort=${server?.gamePort}`,
              alt: `${server?.name} server card`,
              height: 600,
              width: 1200,
            },
          ],
        }}
      />

      {server?.name && server?.version ? (
        <>
          <div className="relative flex h-48 items-end py-4">
            <BackgroundImage src={getIslandImageURL(server?.relatedIsland?.terrainId)} />

            <Grid.Container className="z-10">
              <Grid xs={24} className="flex flex-col items-start">
                <Text h1 margin={0} width="100%" className="break-words leading-tight">
                  {server.name}
                </Text>

                <Spacer h={1 / 2} inline />

                <div className="flex space-x-2">
                  {server.isPassword && <ServerFeatureBadge type="warning" label="Passworded" icon={<Lock />} />}
                  {server.isFirstPerson && <ServerFeatureBadge type="success" label="First person" icon={<User />} />}
                  {server.isPublicHive && <ServerFeatureBadge type="default" label="Official" icon={<Check />} />}
                  {isExperimental && <ServerFeatureBadge backgroundColor={theme.palette.cyan} label="Experimental" icon={<Tool />} />}
                  {server.isMonetised && (
                    <ServerFeatureBadge type="secondary" backgroundColor={theme.palette.violet} label="Monetized" icon={<DollarSign />} />
                  )}
                  {server.isBattleEye ? (
                    <ServerFeatureBadge type="secondary" label="Protected (BattlEye)" icon={<Shield />} />
                  ) : (
                    <ServerFeatureBadge type="error" label="Unprotected (BattlEye)" icon={<ShieldOff />} />
                  )}
                </div>
              </Grid>
            </Grid.Container>
          </div>

          <div className="relative flex flex-auto py-8">
            <div className="flex flex-auto flex-col">
              <div className="flex items-start">
                <Button onClick={onPlayClick} type="success-light" icon={<Play />} scale={4 / 3}>
                  Play
                </Button>
              </div>

              <Spacer h={1} />

              <div className="flex flex-auto space-x-6">
                <div className="flex flex-auto flex-col">
                  <Text h3>Server details</Text>

                  <div className="grid w-full grid-flow-row grid-cols-3 gap-6">
                    <ServerInfoCard iconDescription="Players" icon={<Users />} item={<PlayerCount server={server} type="h3" />} />

                    <ServerInfoCard
                      iconDescription="Map"
                      icon={<Map />}
                      item={
                        <Text h3 margin={0}>
                          {server?.relatedIsland?.name || server.island}
                        </Text>
                      }
                    />

                    <ServerInfoCard
                      iconDescription="Version"
                      icon={<Tag />}
                      item={
                        <div className="flex items-center">
                          <Text h3 margin={0}>
                            {server.version}
                          </Text>

                          <Spacer w={1 / 2} />

                          {dayzVersion?.stable ? (
                            <>
                              {isLatestGameVersion ? (
                                <Tooltip text={`This server is running the latest version of DayZ${isExperimental ? ' Experimental' : ''}`}>
                                  <Check color={theme.palette.success} />
                                </Tooltip>
                              ) : (
                                <Tooltip text={`This server is running an outdated version of DayZ${isExperimental ? ' Experimental' : ''}`}>
                                  <AlertTriangle color={theme.palette.warning} />
                                </Tooltip>
                              )}
                            </>
                          ) : null}
                        </div>
                      }
                    />

                    <ServerTimeCard server={server} />
                  </div>
                </div>

                <div className="flex w-3/12 flex-auto">
                  <ServerModList mods={workshopMods ?? []} isLoading={isLoadingMods} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-auto items-center justify-center">
          {isLoadingServer ? <Loading scale={4 / 3}>Loading server...</Loading> : <Text h3>Server not found.</Text>}
        </div>
      )}
    </>
  );
};

export default ServerPage;
