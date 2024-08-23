import { Text, TextInput, View } from "react-native";
import { Card } from "./card";
import { Controller, useFormState } from "react-hook-form";

export function ControlledKanjiReadingInput({
  reading,
}: {
  reading: "kun" | "on";
}) {
  const { errors } = useFormState();
  return (
    <View
      style={{
        marginBottom: 8,
      }}
    >
      <Card
        style={{
          marginBottom: 4,
          alignItems: "center",
          flexDirection: "row",
          marginHorizontal: 14,
        }}
      >
        <Text
          style={{
            color: "whitesmoke",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {reading === "kun" ? "Kun: " : "On:"}
        </Text>
        <Controller
          name={reading}
          render={({ field: { onChange, value, ...rest } }) => (
            <TextInput
              {...rest}
              onChangeText={onChange}
              style={{
                flex: 1,
                fontSize: 14,
                color: "whitesmoke",
                borderBottomWidth: 1,
                borderBottomColor: "#404040",
                paddingBottom: 5,
              }}
            />
          )}
          rules={{
            pattern: /^[\u3040-\u309F\u30A0-\u30FF\s,;\u3000\u3001\u3002]+$/,
          }}
        />
      </Card>
      <Text style={{ color: "red", paddingLeft: 8 }}>
        {errors[reading] && "Must contain only hiragana or katakana"}
      </Text>
    </View>
  );
}
