import React, { useState } from 'react';
import { Image as GeistImage, useTheme } from '@geist-ui/react';

interface Props extends React.HTMLProps<HTMLImageElement> {
  src: string;
  unloader?: React.ReactNode;
}

const Image: React.FC<Props> = ({ src, unloader, style, className, width, height }) => {
  const { palette } = useTheme();
  const [hasError, setHasError] = useState<boolean>(false);

  function onError() {
    setHasError(true);
  }

  return !hasError ? (
    <GeistImage onError={onError} src={src} style={style} className={className} width={width} height={height} />
  ) : (
    <>
      {unloader || (
        <>
          <div className="" style={{ background: palette.accents_2, height, width }}></div>
        </>
      )}
    </>
  );
};

export default Image;
