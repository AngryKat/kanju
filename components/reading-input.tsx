import { useEffect, useState } from "react";
import { View, TextInput, Text } from "react-native";

export const validateReadings = (reading: string) => {
  if (reading.length === 0) return true
  const regexKatakanaHiragana =
    /^[\u3040-\u309F\u30A0-\u30FF\s,;\u3000\u3001\u3002]+$/;
  return regexKatakanaHiragana.test(reading);
};

const ReadingInputValue = ({
  error,
  onChangeText,
  initValue,
}: {
  error: boolean;
  onChangeText: (value: string) => void;
  initValue: string[];
}) => {
  const [value, setValue] = useState(initValue.join("、"));
  const handleChangeText = (newText: string) => {
    setValue(newText);
    onChangeText(newText);
  };
  return (
    <TextInput
      onChangeText={handleChangeText}
      value={value}
      style={{
        flex: 1,
        borderBottomColor: error ? "red" : "#404040",
        borderBottomWidth: 1,
        color: "whitesmoke",
        paddingBottom: 5,
      }}
    />
  );
};

const renderText = (value: string[]) => {
  return (
    <Text
      style={{
        flex: 1,
        color: "whitesmoke",
      }}
    >
      {value.join("、")}
    </Text>
  );
};

export function ReadingInput({
  title,
  onInputChange,
  initValue,
  readOnly = false,
}: {
  initValue: string[];
  title: string;
  onInputChange: (value: any) => void;
  readOnly?: boolean;
}) {
  const [error, setError] = useState(false);
  const handleInputChange = (newReadings: string) => {
    if (newReadings === "") {
      onInputChange([]);
      return;
    }
    const arr = newReadings.split(/[\s,;\u3000\u3001\u3002]+/);
    onInputChange(arr);
    setError(!validateReadings(newReadings));
  };

  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 50,
        }}
      >
        <Text style={{ color: "white", fontWeight: 600, fontSize: 16 }}>
          {title}:{" "}
        </Text>
        {readOnly ? (
          renderText(initValue)
        ) : (
          <ReadingInputValue
            error={error}
            onChangeText={handleInputChange}
            initValue={initValue}
          />
        )}
      </View>
      {error && (
        <Text style={{ color: "red" }}>
          Can only contain hiragana or katakana
        </Text>
      )}
    </>
  );
}
