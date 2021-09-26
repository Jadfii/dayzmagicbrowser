import React from 'react';
import './background-image.scss';
import { Image } from '@geist-ui/react';

interface Props {
  src: string;
}

const BackgroundImage: React.FC<Props> = ({ src }) => {
  return (
    <>
      <div className="background-image w-full h-full overflow-hidden">
        <div />
        <Image src={src} width="100%" height="auto" style={{ objectFit: 'cover' }} />
      </div>
    </>
  );
};

export default BackgroundImage;
