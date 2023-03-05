import { Select, SelectProps } from '@geist-ui/core';
import { cn } from '../../utils/css.util';
import FormItemLabel from '../FormItemLabel/FormItemLabel';

interface CustomSelectProps extends SelectProps {
  label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, children, className, ...rest }) => {
  return (
    <>
      {label ? (
        <FormItemLabel label={label}>
          <Select {...rest} className={cn('w-full', className)}>
            {children}
          </Select>
        </FormItemLabel>
      ) : (
        <Select {...rest} className={cn('w-full', className)}>
          {children}
        </Select>
      )}
    </>
  );
};

export default CustomSelect;
