import { Loading } from '@geist-ui/core';
import React from 'react';

const SuspenseLoader: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-auto items-center justify-center">
      <Loading scale={3}></Loading>
    </div>
  );
};

export default SuspenseLoader;
