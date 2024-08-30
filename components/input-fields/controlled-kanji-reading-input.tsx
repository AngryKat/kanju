import { Text, TextInput, View } from "react-native";
import { Card } from "../ui/card";
import { Controller, useForm, useFormState, useWatch } from "react-hook-form";
import { useKanjiPageContext } from "../kanji-page-layout/kanji-page-context";
import { regex_hiragana_katakana } from "@/constants/regex";

export function ControlledKanjiReadingInput({
  reading,
}: {
  reading: "kun" | "on";
}) {
  const { errors } = useFormState();
  const { mode } = useKanjiPageContext();
  const readOnly = mode === "read";
  const on = useWatch({ name: "on" });
  const kun = useWatch({ name: "kun" });
  const visible = (readOnly && !!on) || (readOnly && !!kun) || !readOnly;

  if (!visible) return null;
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
              onChangeText={(text: string) => {
                onChange(text);
              }}
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
            pattern: regex_hiragana_katakana,
            required:
              (reading === "kun" && on.length === 0) ||
              (reading === "on" && kun.length === 0),
          }}
        />
      </Card>
      <Text style={{ color: "red", paddingLeft: 8 }}>
        {errors[reading] && "Must contain only hiragana or katakana"}
      </Text>
    </View>
  );
}
