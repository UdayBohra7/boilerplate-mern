import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";

import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";

type Option = {
  label: React.ReactNode;
  value: string | number;
};

type RadioButtonFieldProps = FieldWrapperPassThroughProps & {
  className?: string;
  value?: string;
  label: string;
  type?: string;
  registration: Partial<UseFormRegisterReturn>;
  options: Option[];
};

export const RadioField = (props: RadioButtonFieldProps) => {
  const {
    label,
    options,
    className,
    registration,
    error,
    type = "radio",
  } = props;
  return (
    <FieldWrapper error={error} label={label}>
      {options.map((option, i) => {
        const id = Math.random();
        return (
          <div key={i} className="form-check">
            <input
              {...registration}
              className={clsx(className, "form-check-input")}
              type={type}
              value={option.value}
              id={`${id}id` ?? "flexCheckDefault"}
            />
            <label
              className="form-check-label"
              htmlFor={`${id}id` ?? "flexCheckDefault"}
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </FieldWrapper>
  );
};
