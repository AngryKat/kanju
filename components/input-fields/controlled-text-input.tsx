import { ComponentProps } from "react";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import { TextInput, type TextStyle } from "react-native";

type ControllerPropsType = ComponentProps<typeof Controller>;
type TextInputPropsType = ComponentProps<typeof TextInput>;

export type ControlledTextInputHandleChange = (...event: any[]) => void;

export function ControlledTextInput({
  handleChange,
  textInputProps,
  ...controllerProps
}: {
  textInputProps?: TextInputPropsType;
  handleChange?: (
    onChange: ControlledTextInputHandleChange
  ) => (value: string) => void;
} & Omit<ControllerPropsType, "render">) {
  return (
    <Controller
      render={({ field: { onChange, ...fieldProps } }) => (
        <TextInput
          {...textInputProps}
          {...fieldProps}
          onChangeText={!!handleChange ? handleChange(onChange) : onChange}
        />
      )}
      {...controllerProps}
    />
  );
}
