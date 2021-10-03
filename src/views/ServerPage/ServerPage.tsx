import { Card, Grid, Spacer, Text, Tooltip } from '@geist-ui/react';
import { Clock, Lock, Map, User, Users } from '@geist-ui/react-icons';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';
import PlayerCount from '../../components/PlayerCount/PlayerCount';
import ServerModList from '../../components/ServerModList/ServerModList';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { ServersContext } from '../../contexts/ServersProvider';
import useWorkshopAPI from '../../data/useWorkshopAPI';
import { Island, Server, WorkshopMod } from '../../types/Types';

const ICON_SIZE = 48;

interface InfoCardProps {
  icon: React.ReactElement;
  iconDescription: string;
  item: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, iconDescription, item }) => {
  return (
    <Card className="self-start">
      <div className="flex items-center h-16">
        <Tooltip text={iconDescription}>{React.cloneElement(icon, { size: 40 })}</Tooltip>

        <Spacer w={1} />

        {item}
      </div>
    </Card>
  );
};

const ServerPage: React.FC = () => {
  const { serverIp, serverPort } = useParams<{ serverIp: string; serverPort: string }>();
  const { getWorkshopMods } = useWorkshopAPI();
  const { servers, findServerByIpPort } = useContext(ServersContext);
  const { getIslandByTerrain } = useContext(IslandsContext);

  const [serverMods, setServerMods] = useState<WorkshopMod[]>([]);
  const [isLoadingMods, setIsLoadingMods] = useState<boolean>(true);

  const server: Server | undefined = useMemo(
    () => (servers.length > 0 ? findServerByIpPort(serverIp, Number(serverPort), true) : undefined),
    [servers, serverIp, serverPort]
  );

  const serverIsland: Island | undefined = useMemo(() => getIslandByTerrain(server?.island || ''), [server?.island]);

  async function loadMods() {
    if (!server?.mods?.length) return setIsLoadingMods(false);

    setIsLoadingMods(true);
    setServerMods(await getWorkshopMods(server.mods.map((mod) => mod.steamId)));
    setIsLoadingMods(false);
  }

  useEffect(() => {
    loadMods();
  }, [server?.mods]);

  return server?.name ? (
    <>
      <div className="relative flex items-end h-48 py-4">
        <BackgroundImage src={serverIsland?.imageURL || ''} />

        <Grid.Container>
          <Grid xs={22} className="items-center">
            <Text h1 margin={0} className="truncate">
              {server.name}
            </Text>
          </Grid>

          <Grid xs={2} className="px-2 items-center">
            {server.hasPassword && <Lock size={ICON_SIZE} />}

            <Spacer w={1 / 2} />

            {server.isFirstPerson && <User size={ICON_SIZE} />}
          </Grid>
        </Grid.Container>
      </div>

      <div className="relative flex flex-auto py-10">
        <div className="flex-auto mr-6">
          <Text h3>Server details</Text>

          <div className="grid grid-cols-3 grid-flow-row gap-6 w-full">
            <InfoCard iconDescription="Players" icon={<Users />} item={<PlayerCount server={server} type="h2" />} />

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
              iconDescription="Server time"
              icon={<Clock />}
              item={
                <Text h3 margin={0}>
                  {server.time}
                </Text>
              }
            />
          </div>
        </div>

        <div className="flex flex-auto w-3/12">
          <ServerModList mods={serverMods.sort((a, b) => b.subscriptions - a.subscriptions)} isLoading={isLoadingMods} />
        </div>
      </div>
    </>
  ) : null;
};

export default ServerPage;
