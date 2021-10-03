import React, { Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import SuspenseLoader from '../components/SuspenseLoader/SuspenseLoader';
import useScrollTop from '../hooks/useScrollTop';

const Home = React.lazy(() => import('../views/Home/Home'));
const Servers = React.lazy(() => import('../views/Servers/Servers'));
const ServerPage = React.lazy(() => import('../views/ServerPage/ServerPage'));
const PlayServer = React.lazy(() => import('../views/PlayServer/PlayServer'));

const Routes: React.FC = () => {
  useScrollTop();

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/servers" exact component={Servers} />
        <Route path="/server/:serverIp/:serverPort" exact component={ServerPage} />
        <Route path="/play/:serverIp/:serverPort" exact component={PlayServer} />

        <Route component={() => <Redirect to="/" />} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
