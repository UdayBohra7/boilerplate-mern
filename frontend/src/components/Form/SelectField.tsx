import Select from "react-select";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";
import { Controller, UseFormRegisterReturn, Control } from "react-hook-form";

type Option = {
  label: React.ReactNode;
  value: string | number;
};

type InputFieldProps = FieldWrapperPassThroughProps & {
  options: Option[];
  registration: Partial<UseFormRegisterReturn>;
  control: Control<any>;
};

export const SelectField = (props: InputFieldProps) => {
  const { registration, error, options, label, control } = props;
  const { name } = registration;

  return (
    <FieldWrapper error={error} label={label}>
      <Controller
        name={name ?? ""}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select<Option>
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                lineHeight: 2,
                borderColor: error?.message ? "red" : "#dee2e6",
                borderRadius: "0.375rem",
              }),
            }}
            onChange={(newVal) => {
              const values = newVal?.value;
              onChange(values);
            }}
            isSearchable
            defaultValue={options.find((i) => value?.includes(i.value))}
            placeholder={label}
            options={options}
          />
        )}
      />
    </FieldWrapper>
  );
};
