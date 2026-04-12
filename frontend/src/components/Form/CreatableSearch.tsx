import CreatableSelect from "react-select/creatable";
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
  isMulti?: boolean;
};

export const CreatableSearch = (props: InputFieldProps) => {
  const {
    registration,
    error,
    options,
    label,
    control,
    isMulti = false,
  } = props;
  const { name } = registration;

  return (
    <FieldWrapper error={error} label={label}>
      <Controller
        name={name ?? ""}
        control={control}
        render={({ field: { value, onChange } }) => (
          <CreatableSelect
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                lineHeight: 2,
                borderColor: error?.message ? "red" : "#dee2e6",
                borderRadius: "0.375rem",
              }),
            }}
            onChange={(newVal) => {
              if (isMulti && Array.isArray(newVal)) {
                const values = newVal.map((i) => i.value);
                onChange(values);
              } else {
                const val: any = { ...newVal };
                const values = val?.value;
                onChange(values);
              }
            }}
            defaultValue={options.filter((i) => value?.includes(i.value))}
            placeholder={label}
            options={options}
            isMulti={isMulti}
          />
        )}
      />
    </FieldWrapper>
  );
};
