import { Loading } from '@geist-ui/react';
import React from 'react';

const SuspenseLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center flex-auto w-full h-full">
      <Loading scale={3}></Loading>
    </div>
  );
};

export default SuspenseLoader;
