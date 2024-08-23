import { ComponentProps } from "react";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import { TextInput, type TextStyle } from "react-native";

export function ControlledTextInput({
  name,
  rules,
  style,
  placeholder,
}: {
  name: string;
  rules?: ComponentProps<typeof Controller>["rules"];
  style?: TextStyle;
  placeholder?: string;
}) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, ...rest } }) => (
        <TextInput
          {...rest}
          onChangeText={onChange}
          style={style}
          placeholder={placeholder}
        />
      )}
      rules={rules}
    />
  );
}
