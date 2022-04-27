import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Button, Grid, Loading, Spacer, Text, Tooltip, useTheme } from '@geist-ui/react';
import { Check, Lock, Map, Shield, ShieldOff, User, Users, Tag, Play, Tool, DollarSign, AlertTriangle } from '@geist-ui/react-icons';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import prisma, { serialiseServer } from '../../../lib/prisma';
import BackgroundImage from '../../../components/BackgroundImage/BackgroundImage';
import PlayerCount from '../../../components/PlayerCount/PlayerCount';
import ServerModList from '../../../components/ServerModList/ServerModList';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import ServerFeatureBadge from '../../../components/ServerFeatureBadge/ServerFeatureBadge';
import ServerInfoCard from '../../../components/ServerInfoCard/ServerInfoCard';
import ServerTimeCard from '../../../components/ServerTimeCard/ServerTimeCard';
import { getWorkshopMods } from '../../../data/SteamApi';
import { getIslandImageURL } from '../../../constants/links.constant';
import { isMatchingVersion } from '../../../data/Version';
import { WorkshopMod } from '../../../types/Types';
import useDayzVersion from '../../../hooks/useDayzVersion';

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  if (!params?.serverIp || !params?.serverPort) {
    return {
      notFound: true,
    };
  }

  const server = await prisma.server.findFirst({
    where: {
      ipAddress: String(params?.serverIp),
      gamePort: Number(params?.serverPort),
    },
    include: {
      relatedIsland: true,
    },
  });

  if (!server?.ipAddress) {
    return {
      notFound: true,
    };
  }

  // Caching
  res.setHeader('Cache-Control', `s-maxage=60, stale-while-revalidate`);

  let workshopMods: WorkshopMod[] = [];

  if (server?.modIds?.length > 0) {
    try {
      workshopMods = await getWorkshopMods(server?.modIds.map((modId) => String(modId)));
    } catch (err) {
      console.error(err);
    }
  }

  return {
    props: {
      server: serialiseServer(server),
      workshopMods,
    },
  };
};

const ServerPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ server, workshopMods }) => {
  const theme = useTheme();
  const { dayzVersion } = useDayzVersion();

  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(true);

  const isExperimental: boolean = useMemo(() => server?.appId === DAYZ_EXP_APPID, [server?.appId]);
  const isLatestGameVersion: boolean = useMemo(
    () =>
      server?.version &&
      dayzVersion?.stable &&
      dayzVersion?.exp &&
      isMatchingVersion(server?.version, isExperimental ? dayzVersion?.exp : dayzVersion?.stable),
    [server?.version, dayzVersion, isExperimental]
  );

  useEffect(() => {
    if (!server?.ipAddress) {
      return;
    }

    console.log(server);

    setIsLoadingServer(false);
  }, [server]);

  return (
    <>
      <NextSeo title={server?.name} description={`View information about server "${server?.name}".`} />

      {server?.name && server?.version ? (
        <>
          <div className="relative flex items-end h-48 py-4">
            <BackgroundImage src={getIslandImageURL(server?.relatedIsland?.terrainId)} />

            <Grid.Container className="z-10">
              <Grid xs={24} className="flex flex-col items-start">
                <Text h1 margin={0} width="100%" className="leading-tight break-words">
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
            <div className="flex flex-col flex-auto">
              <div className="flex items-start">
                <Link href={`/play/${server.ipAddress}/${server.gamePort}`}>
                  <a>
                    <Button type="success-light" icon={<Play />} scale={4 / 3}>
                      Play
                    </Button>
                  </a>
                </Link>
              </div>

              <Spacer h={1} />

              <div className="flex flex-auto space-x-6">
                <div className="flex flex-col flex-auto">
                  <Text h3>Server details</Text>

                  <div className="grid grid-cols-3 grid-flow-row gap-6 w-full">
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

                <div className="flex flex-auto w-3/12">{workshopMods && <ServerModList mods={workshopMods} />}</div>
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
