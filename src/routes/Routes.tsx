import React, { Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import SuspenseLoader from '../components/SuspenseLoader/SuspenseLoader';

const Home = React.lazy(() => import('../views/Home/Home'));
const Servers = React.lazy(() => import('../views/Servers/Servers'));

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/servers" exact component={Servers} />

        <Route component={() => <Redirect to="/" />} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
