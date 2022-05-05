import { Select, SelectProps } from '@geist-ui/core';
import FormItemLabel from '../FormItemLabel/FormItemLabel';

interface CustomSelectProps extends SelectProps {
  label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, children, ...rest }) => {
  return (
    <>
      {label ? (
        <FormItemLabel label={label}>
          <Select {...rest}>{children}</Select>
        </FormItemLabel>
      ) : (
        <Select {...rest}>{children}</Select>
      )}
    </>
  );
};

export default CustomSelect;
