import React from 'react';
import Image from '../Image/Image';
import './background-image.scss';

interface Props {
  src: string;
}

const BackgroundImage: React.FC<Props> = ({ src }) => {
  return (
    <>
      <div className="background-image w-full h-full overflow-hidden">
        <div />
        <Image src={src} width="100%" height="100%" style={{ objectFit: 'cover' }} />
      </div>
    </>
  );
};

export default BackgroundImage;
