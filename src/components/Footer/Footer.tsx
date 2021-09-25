import { useTheme } from '@geist-ui/react';
import React from 'react';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <div className="flex items-center w-full mt-auto" style={{ background: theme.palette.background }}>
      <h2>Footer</h2>
    </div>
  );
};

export default Footer;
