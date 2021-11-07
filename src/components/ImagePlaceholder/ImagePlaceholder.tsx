import React from 'react';
import { useTheme } from '@geist-ui/react';

const ImagePlaceholder: React.FC = () => {
  const theme = useTheme();

  return <div className="h-full w-full" style={{ background: theme.palette.accents_2 }}></div>;
};

export default ImagePlaceholder;
