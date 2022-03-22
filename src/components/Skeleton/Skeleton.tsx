import { useTheme } from '@geist-ui/react';
import React, { useMemo } from 'react';

interface Props {
  cols?: number;
  rows?: number;
  height?: number;
  width?: number;
}

const Skeleton: React.FC<Props> = ({ cols, rows, height, width }) => {
  const theme = useTheme();

  const skeletonHeight = useMemo((): string => {
    if (height) return `${height}px`;
    else if (rows) return `calc(${rows} * 1rem)`;
    else return '100%';
  }, [height, rows]);

  const skeletonWidth = useMemo((): string => {
    if (width) return `${width}px`;
    else if (cols) return `calc(${cols} * 1rem)`;
    else return '100%';
  }, [width, height, rows]);

  return (
    <>
      <div
        className="skeleton"
        style={{
          backgroundImage: `linear-gradient(270deg, ${theme.palette.accents_1}, ${theme.palette.accents_2}, ${theme.palette.accents_2}, ${theme.palette.accents_1})`,
        }}
      ></div>

      <style jsx>{`
        .skeleton {
          height: ${skeletonHeight};
          width: ${skeletonWidth};

          border-radius: 5px;
        }
      `}</style>
    </>
  );
};

export default Skeleton;
