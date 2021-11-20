import { useTheme } from '@geist-ui/react';
import React from 'react';

interface Props {
  cols?: number;
  rows?: number;
  height?: number;
  width?: number;
}

const Skeleton: React.FC<Props> = ({ cols, rows, height, width }) => {
  const theme = useTheme();

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
          height: ${height ? `${height}px` : rows ? `calc(${rows} * 1rem)` : `100%`};
          width: ${width ? `${height}px` : cols ? `calc(${cols} * 1rem)` : `100%`};

          border-radius: 5px;
        }
      `}</style>
    </>
  );
};

export default Skeleton;
