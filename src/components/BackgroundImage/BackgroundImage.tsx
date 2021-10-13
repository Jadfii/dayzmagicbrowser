import React from 'react';
import Image from 'next/image';

interface Props {
  src: string;
}

const BackgroundImage: React.FC<Props> = ({ src }) => {
  return (
    <>
      <div className="absolute w-full h-full overflow-hidden" style={{ top: 0, left: 0 }}>
        <div />
        <div className="relative w-full h-full">
          <Image
            loader={({ src }) => src}
            alt="Background image"
            src={src}
            layout="fill"
            unoptimized
            loading="eager"
            className="object-cover opacity-25 rounded-none z-0"
          />
        </div>
      </div>
    </>
  );
};

export default BackgroundImage;
