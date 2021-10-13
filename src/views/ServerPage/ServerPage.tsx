import { Button, Grid, Loading, Spacer, Text, Tooltip, useTheme } from '@geist-ui/react';
import { Check, Lock, Map, Shield, ShieldOff, User, Users, Tag, Play, Tool } from '@geist-ui/react-icons';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';
import Meta from '../../components/Meta/Meta';
import PlayerCount from '../../components/PlayerCount/PlayerCount';
import ServerModList from '../../components/ServerModList/ServerModList';
import { DAYZ_EXP_APPID } from '../../constants/game.constant';
import { GameContext } from '../../contexts/GameProvider';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { ServersContext } from '../../contexts/ServersProvider';
import useWorkshopAPI from '../../data/useWorkshopAPI';
import { Island, Server, WorkshopMod } from '../../types/Types';
import FeatureBadge from './FeatureBadge';
import InfoCard from './InfoCard';
import ServerTimeCard from './ServerTimeCard';

const ServerPage: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const { serverIp, serverPort } = router.query;
  const { getWorkshopMods } = useWorkshopAPI();
  const { servers, findServerByIpPort } = useContext(ServersContext);
  const { getIslandByTerrain } = useContext(IslandsContext);
  const { isLatestGameVersion } = useContext(GameContext);

  const [server, setServer] = useState<Server | undefined>(undefined);

  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(true);

  const [serverMods, setServerMods] = useState<WorkshopMod[]>([]);
  const [isLoadingMods, setIsLoadingMods] = useState<boolean>(true);

  const serverIsland: Island | undefined = useMemo(() => getIslandByTerrain(server?.island || ''), [server?.island]);

  const isExperimental = useMemo(() => server?.appId === DAYZ_EXP_APPID, [server?.appId]);

  async function loadMods() {
    if (!server?.mods?.length) return setIsLoadingMods(false);

    setIsLoadingMods(true);
    const workshopMods = await getWorkshopMods(server.mods.map((mod) => mod.steamId));
    setServerMods(
      workshopMods
        .map((mod) => (!mod?.name ? { ...mod, name: server?.mods?.find((m) => m.steamId === mod.id)?.name || '' } : mod))
        .filter((mod) => mod?.name)
    );
    setIsLoadingMods(false);
  }

  function onPlay() {
    if (!server?.ip) return;

    router.push(`/play/${server.ip}/${server.gamePort}`);
  }

  useEffect(() => {
    loadMods();
  }, [server?.mods]);

  useEffect(() => {
    if (server?.name) setIsLoadingServer(false);
  }, [server?.name]);

  useEffect(() => {
    if (!serverIp || !serverPort || servers.length === 0) return;

    const foundServer = findServerByIpPort(serverIp as string, Number(serverPort as string), true);
    setServer(foundServer);

    if (foundServer) console.log(foundServer);

    setIsLoadingServer(false);
  }, [servers, serverIp, serverPort]);

  return server?.name ? (
    <>
      <Meta title={server.name} />

      <div className="relative flex items-end h-40 py-4">
        <BackgroundImage src={serverIsland?.imageURL || ''} />

        <Grid.Container className="z-10">
          <Grid xs={24} className="flex flex-col items-start">
            <Text h1 margin={0} width="100%" className="leading-tight">
              {server.name}
            </Text>

            <div className="flex space-x-2">
              {server.hasPassword && <FeatureBadge type="warning" label="Passworded" icon={<Lock />} />}
              {server.isFirstPerson && <FeatureBadge type="success" label="First person" icon={<User />} />}
              {server.isPublicHive && <FeatureBadge type="default" label="Official" icon={<Check />} />}
              {isExperimental && <FeatureBadge backgroundColor={theme.palette.cyan} label="Experimental" icon={<Tool />} />}
              {server.isBattleEye ? (
                <FeatureBadge type="secondary" label="Protected (BattlEye)" icon={<Shield />} />
              ) : (
                <FeatureBadge type="error" label="Unprotected (BattlEye)" icon={<ShieldOff />} />
              )}
            </div>
          </Grid>
        </Grid.Container>
      </div>

      <div className="relative flex flex-auto py-8">
        <div className="flex flex-col flex-auto">
          <div className="flex items-start">
            <Button onClick={onPlay} type="success-light" icon={<Play />} scale={4 / 3}>
              Play
            </Button>
          </div>

          <Spacer h={1} />

          <div className="flex flex-auto space-x-6">
            <div className="flex flex-col flex-auto">
              <Text h3>Server details</Text>

              <div className="grid grid-cols-3 grid-flow-row gap-6 w-full">
                <InfoCard iconDescription="Players" icon={<Users />} item={<PlayerCount server={server} type="h3" />} />

                <InfoCard
                  iconDescription="Map"
                  icon={<Map />}
                  item={
                    <Text h3 margin={0}>
                      {serverIsland?.name || server.island}
                    </Text>
                  }
                />

                <InfoCard
                  iconDescription="Version"
                  icon={<Tag />}
                  item={
                    <div className="flex items-center">
                      <Text h3 margin={0}>
                        {server.version}
                      </Text>

                      <Spacer w={1 / 2} />

                      {isLatestGameVersion && isLatestGameVersion(server.version, isExperimental) && (
                        <Tooltip text={`This server is running the latest version of DayZ${isExperimental ? ' Experimental' : ''}`}>
                          <Check color={theme.palette.success} />
                        </Tooltip>
                      )}
                    </div>
                  }
                />

                <ServerTimeCard server={server} />
              </div>
            </div>

            <div className="flex flex-auto w-3/12">
              <ServerModList mods={serverMods.sort((a, b) => b.subscriptions - a.subscriptions)} isLoading={isLoadingMods} />
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-auto items-center justify-center">
      {isLoadingServer ? <Loading scale={4 / 3}>Loading server...</Loading> : <Text h3>Server not found.</Text>}
    </div>
  );
};

export default ServerPage;
