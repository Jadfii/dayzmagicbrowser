import { Text, useTheme } from '@geist-ui/core';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<unknown> {
  label: string;
}

const FormItemLabel: React.FC<Props> = ({ label, children }) => {
  const theme = useTheme();

  return (
    <div>
      <Text my={0} mb={'0.5em'} font="14px" style={{ color: theme.palette.accents_6, lineHeight: 1.5 }}>
        {label}
      </Text>

      {children}
    </div>
  );
};

export default FormItemLabel;
