import { GetStaticPaths, GetStaticProps } from 'next';
import { Badge, Button, Grid, Loading, Spacer, Text, Tooltip, useTheme } from '@geist-ui/core';
import {
  Check,
  Lock,
  Map,
  Shield,
  ShieldOff,
  User,
  Users,
  Tag,
  Play,
  Tool,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  RefreshCcw,
} from '@geist-ui/react-icons';
import { NextSeo } from 'next-seo';
import BackgroundImage from '../../../components/BackgroundImage/BackgroundImage';
import PlayerCount from '../../../components/PlayerCount/PlayerCount';
import ServerModList from '../../../components/ServerModList/ServerModList';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import ServerFeatureBadge from '../../../components/ServerFeatureBadge/ServerFeatureBadge';
import ServerInfoCard from '../../../components/ServerInfoCard/ServerInfoCard';
import ServerTimeCard from '../../../components/ServerTimeCard/ServerTimeCard';
import { getIslandImageURL } from '../../../constants/links.constant';
import { getGameVersion, isMatchingVersion } from '../../../data/Version';
import useDayzVersion from '../../../hooks/data/useDayzVersion';
import useWorkshopMods from '../../../hooks/data/useWorkshopMods';
import useConnectServer from '../../../hooks/useConnectServer';
import useCurrentServer from '../../../hooks/data/useCurrentServer';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Endpoint } from '../../../types/Endpoints';
import { getServerPageData } from '../../api/servers/[serverIp]/[serverPort]';
import prisma from '../../../lib/prisma';
import { getWorkshopMods } from '../../../data/SteamApi';
import { getServerDiscord, getServerWebsite } from '../../../utils/server.util';
import { useMemo } from 'react';
import { DiscordIcon } from '../../../components/Icons/DiscordIcon';
import Link from 'next/link';
import useUpdateServer from '../../../hooks/data/useUpdateServer';

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all servers that are not empty
  // We use fallback for every other server
  const servers = await prisma.server.findMany({
    select: { ipAddress: true, gamePort: true },
    where: {
      OR: [
        {
          playerCount: {
            gt: 0,
          },
        },
        {
          queueCount: {
            gt: 0,
          },
        },
      ],
    },
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    take: 750,
  });

  const paths = servers.map((server) => ({ params: { serverIp: server.ipAddress, serverPort: server.gamePort.toString() } }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
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
  await queryClient.prefetchQuery([Endpoint.GAME_VERSION], async () => {
    try {
      const data = await getGameVersion();
      return data ?? null;
    } catch (err) {
      return null;
    }
  });
  await queryClient.prefetchQuery([`${Endpoint.WORKSHOP_MODS}`, `modIds=${encodeURI(server.modIds.join(','))}`], () =>
    getWorkshopMods(server.modIds.map((id) => id.toString()))
  );

  return {
    revalidate: 600,
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const ServerPage: React.FC = () => {
  const theme = useTheme();

  const { data: server, isFetching: isLoadingServer } = useCurrentServer();
  const { data: dayzVersion } = useDayzVersion();
  const { data: workshopMods, isInitialLoading: isLoadingMods } = useWorkshopMods(server?.modIds?.map(String) || []);
  const { mutate: updateServer, isLoading: isUpdatingServer } = useUpdateServer();

  const { connectToServer } = useConnectServer(server);

  const websiteUrl = useMemo(() => getServerWebsite(server?.name), [server?.name]);
  const discordUrl = useMemo(() => getServerDiscord(server?.name), [server?.name]);

  const isExperimental = server?.appId === DAYZ_EXP_APPID;
  const isLatestGameVersion =
    !!server?.version &&
    !!dayzVersion?.stable &&
    !!dayzVersion?.exp &&
    isMatchingVersion(server?.version, isExperimental ? dayzVersion?.exp : dayzVersion?.stable);

  function onPlayClick() {
    connectToServer();
  }

  function onUpdateClick() {
    updateServer({ ipAddress: server?.ipAddress, gamePort: server?.gamePort });
  }

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
                  {server.isSpoofed && <ServerFeatureBadge type="error" label="Potentially fake player count" icon={<AlertTriangle />} />}
                </div>
              </Grid>
            </Grid.Container>
          </div>

          <div className="relative flex flex-auto py-8">
            <div className="flex flex-auto flex-col">
              <div className="flex items-start space-x-4">
                <Button onClick={onPlayClick} type="success-light" icon={<Play />} scale={4 / 3}>
                  Play
                </Button>

                <Button onClick={onUpdateClick} type="secondary-light" loading={isUpdatingServer} auto icon={<RefreshCcw />} scale={4 / 3}>
                  Update information
                </Button>

                {websiteUrl && (
                  <Badge.Anchor>
                    <Badge scale={0.85} type="secondary">
                      Experimental
                    </Badge>
                    <Link href={websiteUrl} target="_blank" rel="noreferrer">
                      <Button type="default" icon={<ExternalLink />} scale={4 / 3} auto>
                        Website
                      </Button>
                    </Link>
                  </Badge.Anchor>
                )}

                {discordUrl && (
                  <Badge.Anchor>
                    <Badge scale={0.85} type="secondary">
                      Experimental
                    </Badge>
                    <Link href={discordUrl} target="_blank" rel="noreferrer">
                      <Button type="default" icon={<DiscordIcon className="fill-white" />} scale={4 / 3} auto className="bg-blurple text-white">
                        Discord
                      </Button>
                    </Link>
                  </Badge.Anchor>
                )}
              </div>

              <div className="mt-8 flex flex-auto flex-wrap gap-x-6 gap-y-8 md:flex-nowrap">
                <div className="flex flex-auto flex-col">
                  <div className="mb-2">
                    <Text h3 className="m-0">
                      Server details
                    </Text>
                  </div>

                  <div className="grid w-full grid-flow-row grid-cols-1 gap-6 xl:grid-cols-4 2xl:grid-cols-3">
                    <ServerInfoCard
                      iconDescription="Players"
                      icon={<Users />}
                      className="xl:col-span-2 2xl:col-span-1"
                      item={<PlayerCount server={server} type="h3" />}
                    />

                    <ServerInfoCard
                      iconDescription="Map"
                      icon={<Map />}
                      className="xl:col-span-2 2xl:col-span-1"
                      item={
                        <Text h3 margin={0}>
                          {server?.relatedIsland?.name || server.island}
                        </Text>
                      }
                    />

                    <ServerInfoCard
                      iconDescription="Version"
                      icon={<Tag />}
                      className="xl:col-span-4 2xl:col-span-1"
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

                    <ServerTimeCard server={server} className="col-span-1 xl:col-span-4 2xl:col-span-3" />
                  </div>
                </div>

                <div className="flex w-full min-w-[50%] md:max-w-sm xl:min-w-[25%] xl:max-w-md">
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
