import React, { useContext, useMemo } from 'react';
import './home.scss';
import { Button, Divider, Grid, Loading, Text } from '@geist-ui/react';
import BackgroundImage from '../../components/BackgroundImage/BackgroundImage';
import { ArrowRight } from '@geist-ui/react-icons';
import { useHistory } from 'react-router-dom';
import { ServersContext } from '../../contexts/ServersProvider';
import ServerCard from '../../components/ServerCard/ServerCard';
import { IMAGE_BUCKET } from '../../constants/links.constant';
import { IslandsContext } from '../../contexts/IslandsProvider';
import { DAYZ_EXP_APPID } from '../../constants/game.constant';

const Home: React.FC = () => {
  const history = useHistory();
  const { servers } = useContext(ServersContext);
  const { getIslandByTerrain } = useContext(IslandsContext);

  const popularServers = useMemo(() => servers.slice(0, 4), [servers]);
  const sampleServers = useMemo(
    () =>
      servers
        .filter(
          (server, i, arr) =>
            getIslandByTerrain(server?.island || '') &&
            arr.findIndex((s) => s['island'] === server['island'] && /^[-a-zA-Z0-9$@$!%*?&#^-_. +]+$/i.test(s.name)) === i
        )
        .slice(0, 4),
    [servers]
  );
  const officialServers = useMemo(() => servers.filter((server) => server.isPublicHive).slice(0, 4), [servers]);
  const expServers = useMemo(() => servers.filter((server) => server.appId === DAYZ_EXP_APPID).slice(0, 4), [servers]);

  return (
    <>
      <div className="relative flex items-center flex-auto" style={{ height: '60vh' }}>
        <BackgroundImage src={`${IMAGE_BUCKET}home.jpg`} />

        <Grid.Container gap={2} className="my-auto">
          <Grid xs={2}></Grid>

          <Grid xs={10} className="relative flex-col">
            <Text h1 margin={'0 0 1rem 0'} style={{ lineHeight: '1.25' }}>
              Find your next favourite DayZ server
            </Text>

            <Text p margin={0}>
              Browse & refine a full list of DayZ servers and connect directly into the game.
              <br />
              All from your browser. No downloads required.
            </Text>

            <div className="mt-10" style={{ width: '75%' }}>
              <Button onClick={() => history.push('/servers')} type="success-light" iconRight={<ArrowRight />} scale={5 / 3} width="100%">
                Browse servers
              </Button>
            </div>
          </Grid>
        </Grid.Container>
      </div>

      <div className="relative flex-auto py-10">
        <div>
          <Text h3 margin={0}>
            Sample servers
          </Text>
          <Text p type="secondary" className="mb-4 mt-0">
            A sample of servers selected randomly
          </Text>
        </div>

        {sampleServers.length > 0 ? (
          <div className="grid grid-cols-4 grid-flow-row gap-6">
            {sampleServers.map((server, i) => (
              <ServerCard server={server} key={i} />
            ))}
          </div>
        ) : (
          <Loading>Loading servers</Loading>
        )}
      </div>

      <Divider />

      <div className="relative flex-auto py-10">
        <div>
          <Text h3 margin={0}>
            Popular servers
          </Text>
          <Text p type="secondary" className="mb-4 mt-0">
            What people are playing at the moment
          </Text>
        </div>

        {popularServers.length > 0 ? (
          <div className="grid grid-cols-4 grid-flow-row gap-6">
            {popularServers.map((server, i) => (
              <ServerCard server={server} key={i} />
            ))}
          </div>
        ) : (
          <Loading>Loading servers</Loading>
        )}
      </div>

      <Divider />

      <div className="relative flex-auto py-10">
        <div>
          <Text h3 margin={0}>
            Official servers
          </Text>
          <Text p type="secondary" className="mb-4 mt-0">
            The most popular official servers
          </Text>
        </div>

        {officialServers.length > 0 ? (
          <div className="grid grid-cols-4 grid-flow-row gap-6">
            {officialServers.map((server, i) => (
              <ServerCard server={server} key={i} />
            ))}
          </div>
        ) : (
          <Loading>Loading servers</Loading>
        )}
      </div>

      <div className="relative flex-auto py-10">
        <div>
          <Text h3 margin={0}>
            Experimental servers
          </Text>
          <Text p type="secondary" className="mb-4 mt-0">
            The most popular experimental branch servers
          </Text>
        </div>

        {expServers.length > 0 ? (
          <div className="grid grid-cols-4 grid-flow-row gap-6">
            {expServers.map((server, i) => (
              <ServerCard server={server} key={i} />
            ))}
          </div>
        ) : (
          <Loading>Loading servers</Loading>
        )}
      </div>
    </>
  );
};

export default Home;
