import React from 'react';
import Image from 'next/image';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';

interface Props {
  src?: string;
}

const BackgroundImage: React.FC<Props> = ({ src }) => {
  return (
    <>
      <div className="absolute w-full h-full overflow-hidden" style={{ top: 0, left: 0 }}>
        <div />
        <div className="relative w-full h-full">
          {src ? (
            <Image alt="Background image" src={src} layout="fill" loading="eager" className="object-cover opacity-25 rounded-none z-0" priority />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </div>
    </>
  );
};

export default BackgroundImage;
