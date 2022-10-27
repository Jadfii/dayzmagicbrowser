import React from 'react';
import { default as NextImage, ImageLoaderProps, ImageProps } from 'next/image';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import Skeleton from '../Skeleton/Skeleton';
import { IMAGE_CDN_URL } from '../../constants/links.constant';

const MAX_WIDTH = 1536;

interface LoaderProps extends ImageLoaderProps {
  maxHeight?: number;
}

const imageKitLoader = ({ src, width, quality, maxHeight }: LoaderProps) => {
  if (src[0] === '/') src = src.slice(1);

  width = Math.min(width, MAX_WIDTH);

  const params = [];
  if (quality) {
    params.push(`q-${quality}`);
  }

  if (maxHeight) {
    params.push(`h-${maxHeight}`);
    params.push(`w-${maxHeight * 4}`);
    params.push(`c-at_least`);
  } else {
    params.push(`w-${width}`);
  }

  const paramsString = params.join(',');

  let urlEndpoint = IMAGE_CDN_URL;
  if (urlEndpoint[urlEndpoint.length - 1] === '/') urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);

  return `${urlEndpoint}/${src}?tr=${paramsString}`;
};

interface Props extends Omit<ImageProps, 'src'> {
  isLoading?: boolean;
  maxHeight?: number;
  src?: string;
}

const Image: React.FC<Props> = ({ isLoading, maxHeight, src, ...rest }) => {
  return (
    <>
      {isLoading ? (
        <>
          <Skeleton />
        </>
      ) : (
        <>{src ? <NextImage src={src} loader={(props) => imageKitLoader({ maxHeight, ...props })} {...rest} /> : <ImagePlaceholder />}</>
      )}
    </>
  );
};

export default Image;
