import { Text, TextInput, View } from "react-native";
import { Card } from "../ui/card";
import { Controller, useFormState } from "react-hook-form";
import { useKanjiPageContext } from "../kanji-page-layout/kanji-page-context";

export function ControlledKanjiReadingInput({
  reading,
}: {
  reading: "kun" | "on";
}) {
  const { errors } = useFormState();
  const { mode } = useKanjiPageContext();
  const readOnly = mode === "read";
  return (
    <View>
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
          render={({ field: { onChange, ...rest } }) => (
            <TextInput
              {...rest}
              onChangeText={onChange}
              style={[
                {
                  flex: 1,
                  fontSize: 14,
                  color: "whitesmoke",

                  paddingBottom: 5,
                },
                !readOnly && {
                  borderBottomWidth: 1,
                  borderBottomColor: "#404040",
                },
              ]}
              readOnly
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
