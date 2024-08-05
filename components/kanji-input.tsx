import {
  View,
  TextInput,
  Text,
} from "react-native";
import { Card } from "./card";
import { Extrapolation, interpolate } from "react-native-reanimated";

export const regexKanji = /[\u4E00-\u9FAF]$/g;

export const validateKanji = (kanji: string) => {
  if (kanji.length === 0) return true;
  return regexKanji.test(kanji) || (regexKanji.test(kanji) && kanji.length === 1);
};

const renderInput = ({
  error,
  onChangeText,
  value,
}: {
  error: boolean;
  onChangeText: (text: string) => void;
  value: string;
}) => (
  <TextInput
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
      borderBottomColor: error ? "red" : "#404040",
    }}
    placeholder="心"
    onChangeText={onChangeText}
    value={value}
  />
);

const renderText = (text: string) => (
  <Text
    style={{
      verticalAlign: "bottom",
      height: 58,
      width: 80,
      fontWeight: "500",
      fontSize: 42,
      textAlign: "center",
      paddingVertical: 8,
      marginBottom: 8,
      color: "whitesmoke",
    }}
  >
    {text}
  </Text>
);

export function KanjiInput({
  value,
  onInputChange,
  readOnly = false,
}: {
  value: string;
  onInputChange: (value: string) => void;
  readOnly?: boolean;
}) {
  const error = !validateKanji(value);

  const handleInputChange = (newValue: string) => {
    onInputChange(newValue);
  };

  return (
    <View>
      <Text
        style={{
          color: "whitesmoke",
          textAlign: "center",
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 12,
          marginTop: 12,
        }}
      >
        Kanji
      </Text>
      <Card
        style={{
          marginHorizontal: "auto",
          borderRadius: 15,
        }}
      >
        {readOnly
          ? renderText(value)
          : renderInput({
              error,
              value,
              onChangeText: handleInputChange,
            })}
      </Card>
      {error && (
        <Text style={{ color: "red", textAlign: "center" }}>
          Can only contain one kanji character
        </Text>
      )}
    </View>
  );
}
