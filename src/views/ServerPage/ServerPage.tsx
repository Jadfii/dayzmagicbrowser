import { Grid, Loading, Text } from '@geist-ui/react';
import { Check, Lock, Map, Shield, ShieldOff, User, Users, Tag } from '@geist-ui/react-icons';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';
import PlayerCount from '../../components/PlayerCount/PlayerCount';
import ServerModList from '../../components/ServerModList/ServerModList';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { ServersContext } from '../../contexts/ServersProvider';
import useWorkshopAPI from '../../data/useWorkshopAPI';
import { Island, Server, WorkshopMod } from '../../types/Types';
import FeatureBadge from './FeatureBadge';
import InfoCard from './InfoCard';
import ServerTimeCard from './ServerTimeCard';

const ServerPage: React.FC = () => {
  const { serverIp, serverPort } = useParams<{ serverIp: string; serverPort: string }>();
  const { getWorkshopMods } = useWorkshopAPI();
  const { servers, findServerByIpPort } = useContext(ServersContext);
  const { getIslandByTerrain } = useContext(IslandsContext);

  const [server, setServer] = useState<Server | undefined>(undefined);

  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(true);

  const [serverMods, setServerMods] = useState<WorkshopMod[]>([]);
  const [isLoadingMods, setIsLoadingMods] = useState<boolean>(true);

  const serverIsland: Island | undefined = useMemo(() => getIslandByTerrain(server?.island || ''), [server?.island]);

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

  useEffect(() => {
    // For development, mods shouldn't be queried if already set
    if (import.meta.env.DEV && serverMods.length > 0) return;

    loadMods();
  }, [server?.mods]);

  useEffect(() => {
    if (server?.name) setIsLoadingServer(false);
  }, [server?.name]);

  useEffect(() => {
    if (servers.length === 0) return;

    const foundServer = findServerByIpPort(serverIp, Number(serverPort), true);
    setServer(foundServer);

    setIsLoadingServer(false);
  }, [servers, serverIp, serverPort]);

  return server?.name ? (
    <>
      <div className="relative flex items-end h-40 py-4">
        <BackgroundImage src={serverIsland?.imageURL || ''} />

        <Grid.Container>
          <Grid xs={24} className="flex flex-col items-start">
            <Text h1 margin={0} className="truncate">
              {server.name}
            </Text>

            <div className="flex space-x-2">
              {server.hasPassword && <FeatureBadge type="warning" label="Passworded" icon={<Lock />} />}
              {server.isFirstPerson && <FeatureBadge type="success" label="First person" icon={<User />} />}
              {server.isPublicHive && <FeatureBadge type="default" label="Official server" icon={<Check />} />}
              {server.isBattleEye ? (
                <FeatureBadge type="secondary" label="Protected (BattlEye)" icon={<Shield />} />
              ) : (
                <FeatureBadge type="error" label="Unprotected (BattlEye)" icon={<ShieldOff />} />
              )}
            </div>
          </Grid>
        </Grid.Container>
      </div>

      <div className="relative flex flex-auto py-10">
        <div className="flex-auto mr-6">
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
                <Text h3 margin={0}>
                  {server.version}
                </Text>
              }
            />

            <ServerTimeCard server={server} />
          </div>
        </div>

        <div className="flex flex-auto w-3/12">
          <ServerModList mods={serverMods.sort((a, b) => b.subscriptions - a.subscriptions)} isLoading={isLoadingMods} />
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
