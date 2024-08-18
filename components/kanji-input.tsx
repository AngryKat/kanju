import { View, TextInput, Text } from "react-native";
import { Card } from "./card";
import { Extrapolation, interpolate } from "react-native-reanimated";
import { useState } from "react";

export const regexKanji = /[\u4E00-\u9FAF]$/;

export const validateKanji = (kanji: string) => {
  return regexKanji.test(kanji) && kanji.length === 1;
};

const KanjiValueInput = ({
  onChangeText,
  initValue,
}: {
  onChangeText: (text: string) => void;
  initValue: string;
}) => {
  const [value, setValue] = useState(initValue);
  const handleChangeText = (newText: string) => {
    setValue(newText);
    onChangeText(newText);
  };

  return (
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
        borderBottomColor: "#404040",
      }}
      placeholder="心"
      onChangeText={handleChangeText}
      value={value}
    />
  );
};

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
  initValue,
  onInputChange,
  readOnly = false,
}: {
  initValue: string;
  onInputChange: (value: string) => void;
  readOnly?: boolean;
}) {
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
        {readOnly ? (
          renderText(initValue)
        ) : (
          <KanjiValueInput
            onChangeText={handleInputChange}
            initValue={initValue}
          />
        )}
      </Card>
    </View>
  );
}
