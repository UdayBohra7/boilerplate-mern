import clsx from "clsx";
import Flatpickr from "react-flatpickr";
import { Controller, UseFormRegisterReturn, Control } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";
import moment from "moment";
import flatpickr from "flatpickr";

type InputDateRangeProps = FieldWrapperPassThroughProps & {
  className?: string;
  value?: string;
  label: string;
  control: Control<any>;
  registration: Partial<UseFormRegisterReturn>;
  options?: Partial<flatpickr.Options.Options>;
};

export const InputDateRange = (props: InputDateRangeProps) => {
  const { className, registration, error, label, control, options = {} } = props;
  const { name } = registration;

  return (
    <FieldWrapper label={label} error={error}>
      <Controller
        name={name ?? ""}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="d-flex position-relative">
              <Flatpickr
                className={clsx("form-control", error?.message && 'is-invalid', className)}
                placeholder="Choose date"
                value={value}
                onChange={(selectedDays) => {
                  onChange(selectedDays);
                }}
                options={{
                  altInput: true,
                  altFormat: "j F, Y",
                  dateFormat: "Y-m-d",
                  mode: "range",
                  ...options
                }}
              />
            <div className="position-absolute clear-icon" onClick={() => onChange([])}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 101 101"
                id="cross"
              >
                <path d="M83.9 17.1c-.9-.9-2.5-.9-3.4 0l-30 30-30-30c-.9-.9-2.5-.9-3.4 0s-.9 2.5 0 3.4l30 30-30 30c-.9.9-.9 2.5 0 3.4.5.5 1.1.7 1.7.7.6 0 1.2-.2 1.7-.7l30-30 30 30c.5.5 1.1.7 1.7.7.6 0 1.2-.2 1.7-.7.9-.9.9-2.5 0-3.4l-30-30 30-30c.9-.9.9-2.4 0-3.4z"></path>
              </svg>
            </div>
          </div>
        )}
      />
    </FieldWrapper>
  );
};
