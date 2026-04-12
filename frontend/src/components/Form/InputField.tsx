import clsx from 'clsx';
import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

const variants = {
  primary: '',
  secondary: 'bg-button',
};

type InputFieldProps = FieldWrapperPassThroughProps & {
  type?: 'text' | 'email' | 'password' | 'number' | 'phone';
  className?: string;
  startIcon?: React.ReactElement;
  placeholder?: string;
  blueLabel?: boolean;
  registration: Partial<UseFormRegisterReturn>;
  variant?: keyof typeof variants;
  floating?: boolean;
};

export const InputField = (props: InputFieldProps) => {
  const {
    type = 'text',
    label,
    variant = 'primary',
    className,
    registration,
    error,
    placeholder,
    startIcon,
    blueLabel = false,
    floating = false,
  } = props;
  const [show, setShow] = useState(false);

  return (
    <FieldWrapper floating={floating} label={label} error={error} blueLabel={blueLabel}>
      {(() => {
        const Input = (
          <input
            type={show ? 'text' : type}
            className={clsx(
              'form-control',
              error?.message && 'is-invalid',
              variants[variant],
              className
            )}
            style={{ paddingRight: type === 'password' ? '35px' : '0.75rem' }}
            placeholder={placeholder ?? label}
            {...registration}
          />
        );

        let InputType = null;

        if (!floating) {
          InputType = Input;
        } else {
          InputType = (
            <div className="form-floating">
              {Input}
              <label>{label}</label>
            </div>
          );
        }

        if (startIcon) {
          return (
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                {startIcon}
              </span>
              {InputType}
            </div>
          );
        }
        return InputType;
      })()}

      {type === 'password' && (
        <span
          onClick={() => setShow(!show)}
          className={clsx('passwordIcon', floating && 'floating-icon', error && 'errored')}
        >
          {!show ? <i className="fa-regular fa-eye" /> : <i className="fa-regular fa-eye-slash" />}
        </span>
      )}
    </FieldWrapper>
  );
};
