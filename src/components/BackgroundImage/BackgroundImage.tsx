import React from 'react';
import Image from '../Image/Image';

interface Props {
  src?: string;
}

const BackgroundImage: React.FC<Props> = ({ src }) => {
  return (
    <>
      <div className="absolute h-full w-full overflow-hidden" style={{ top: 0, left: 0 }}>
        <div />
        <div className="relative h-full w-full">
          <Image alt="Background image" src={src} fill loading="eager" className="z-0 rounded-none object-cover opacity-25" priority />
        </div>
      </div>
    </>
  );
};

export default BackgroundImage;
