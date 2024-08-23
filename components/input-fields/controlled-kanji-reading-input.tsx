import { Text, TextInput, View } from "react-native";
import { Card } from "../ui/card";
import { Controller, useFormState } from "react-hook-form";
import { useKanjiPageContext } from "../kanji-page-layout/kanji-page-context";
import { hiragana_katakana_regex } from "@/constants/regex";

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

                  padding: 5,
                },
                !readOnly && {
                  borderBottomWidth: 1,
                  borderBottomColor: "#404040",
                },
              ]}
              readOnly={readOnly}
            />
          )}
          rules={{
            pattern: hiragana_katakana_regex,
          }}
        />
      </Card>
      <Text style={{ color: "red", paddingLeft: 8 }}>
        {errors[reading] && "Must contain only hiragana or katakana"}
      </Text>
    </View>
  );
}
