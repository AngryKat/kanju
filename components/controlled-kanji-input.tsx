import { ComponentProps } from "react";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import { Text, TextInput, View, ViewStyle, type TextStyle } from "react-native";
import { Extrapolation, interpolate } from "react-native-reanimated";
import { Card } from "./card";

export function ControlledKanjiInput() {
  const { errors } = useFormState();
  return (
    <View style={{
      marginBottom: 14
    }}>
      <Card
        style={{
          alignSelf: "baseline",
          marginHorizontal: "auto",
          marginBottom: 10
        }}
      >
        <Controller
          name="kanji"
          render={({ field: { onChange, value, ...rest } }) => (
            <TextInput
              {...rest}
              onChangeText={onChange}
              style={{
                verticalAlign: "bottom",
                height: 58,
                width: 80,
                fontWeight: "500",
                fontSize: interpolate(
                  value.length,
                  [1, 2, 3],
                  [42, 32, 24],
                  Extrapolation.CLAMP
                ),
                textAlign: "center",
                paddingVertical: 8,
                marginBottom: 8,
                color: "whitesmoke",
                borderBottomWidth: 1,
                borderBottomColor: "#404040",
              }}
              placeholder="心"
            />
          )}
          rules={{
            minLength: 1,
            maxLength: 1,
            pattern: /[\u4E00-\u9FAF]$/,
            required: true,
          }}
        />
      </Card>
      <Text style={{ color: "red", textAlign: "center" }}>
        {errors.kanji && "Must be 1 kanji character"}
      </Text>
    </View>
  );
}
