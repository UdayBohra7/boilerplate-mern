import clsx from 'clsx';
import { Controller, UseFormRegisterReturn, Control } from "react-hook-form";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type InputFieldProps = FieldWrapperPassThroughProps & {
  registration: Partial<UseFormRegisterReturn>;
  value?: string;
  control: Control<any>;
};

export const InputPhone = (props: InputFieldProps) => {
  const { registration, error, label, control } = props;
  const { name } = registration;

  return (
    <FieldWrapper label={label} error={error}>
      <Controller
        name={name ?? ''}
        control={control}
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            className={clsx('form-control phone-control')}
            placeholder="Enter phone number"
            value={value}
            onChange={onChange}
          />
        )}
      />
    </FieldWrapper>
  );
};
