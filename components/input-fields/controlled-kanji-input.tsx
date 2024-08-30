import { Controller, useFormContext, useFormState } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Extrapolation, interpolate } from "react-native-reanimated";
import { Card } from "../ui/card";
import { ControlledTextInputHandleChange } from "./controlled-text-input";
import { useKanjiPageContext } from "../kanji-page-layout/kanji-page-context";
import { regex_kanji } from "@/constants/regex";

const INPUT_VALIDATION_RULES = {
  minLength: 1,
  maxLength: 1,
  pattern: regex_kanji,
  required: true,
};

export function ControlledKanjiInput() {
  const { mode } = useKanjiPageContext();
  const { errors } = useFormState();
  const { setValue } = useFormContext();

  const readOnly = mode === "read" || mode === "edit";

  const handleTextChange =
    (onChange: ControlledTextInputHandleChange) => (newValue: string) => {
      onChange(newValue);
      setValue("dictionary", []);
    };

  return (
    <View>
      <Card
        style={{
          alignSelf: "baseline",
          marginHorizontal: "auto",
          marginBottom: 10,
        }}
      >
        <Controller
          name="kanji"
          render={({ field: { onChange, value, ...rest } }) => {
            return (
              <TextInput
                {...rest}
                value={value}
                onChangeText={handleTextChange(onChange)}
                style={[
                  styles.textInput,
                  !readOnly && {
                    borderBottomWidth: 1,
                    borderBottomColor: "#404040",
                  },
                  {
                    fontSize: interpolate(
                      value.length,
                      [1, 2, 3],
                      [42, 32, 24],
                      Extrapolation.CLAMP
                    ),
                  },
                ]}
                placeholder="心"
                readOnly={readOnly}
              />
            );
          }}
          rules={INPUT_VALIDATION_RULES}
        />
      </Card>
      <Text style={styles.errorText}>
        {errors.kanji && "Must be 1 kanji character"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    verticalAlign: "bottom",
    height: 58,
    width: 80,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 8,
    marginBottom: 8,
    color: "whitesmoke",
  },
  errorText: { color: "red", textAlign: "center" },
});
