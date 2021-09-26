import { Loading } from '@geist-ui/react';
import React from 'react';

const SuspenseLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Loading></Loading>
    </div>
  );
};

export default SuspenseLoader;
