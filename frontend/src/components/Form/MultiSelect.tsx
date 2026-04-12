import Select from "react-select";
import makeAnimated from "react-select/animated";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";
import { Controller, UseFormRegisterReturn, Control } from "react-hook-form";

const animatedComponents = makeAnimated();

type Option = {
  label: React.ReactNode;
  value: string | number;
};

type InputFieldProps = FieldWrapperPassThroughProps & {
  options: Option[];
  registration: Partial<UseFormRegisterReturn>;
  control: Control<any>;
};

export const MultiSelect = (props: InputFieldProps) => {
  const { registration, error, options, label, control } = props;
  const { name } = registration;

  return (
    <FieldWrapper error={error} label={label}>
      <Controller
        name={name ?? ""}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select<Option, true>
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                lineHeight: 2,
                borderColor: error?.message ? "red" : "#dee2e6",
                borderRadius: "0.375rem",
              }),
            }}
            closeMenuOnSelect={false}
            components={animatedComponents}
            onChange={(newVal) => {
              const values = newVal.map((i) => i.value);
              onChange(values);
            }}
            defaultValue={options.filter((i) => value?.includes(i.value))}
            isMulti
            placeholder={label}
            options={options}
          />
        )}
      />
    </FieldWrapper>
  );
};
