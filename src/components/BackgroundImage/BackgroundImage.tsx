import React from 'react';
import './background-image.scss';
import { Image } from '@geist-ui/react';

interface Props {
  src: string;
}

const BackgroundImage: React.FC<Props> = ({ src }) => {
  return (
    <>
      <div className="background-image">
        <div />
        <Image src={src} />
      </div>
    </>
  );
};

export default BackgroundImage;
