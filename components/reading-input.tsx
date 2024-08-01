import { useEffect, useState } from "react";
import { View, TextInput, Text } from "react-native";

const validateReadings = (reading: string) => {
  const regexKatakanaHiragana =
    /^[\u3040-\u309F\u30A0-\u30FF\s,;\u3000\u3001\u3002]+$/;
  return regexKatakanaHiragana.test(reading);
};

const renderInput = ({
  onChangeText,
  value,
  error,
}: {
  onChangeText: (value: string) => void;
  value: string[];
  error: boolean;
}) => (
  <TextInput
    onChangeText={onChangeText}
    value={value.join("、")}
    style={{
      flex: 1,
      borderBottomColor: error ? "red" : "darkgray",
      borderBottomWidth: 1,
      color: "whitesmoke",
    }}
  />
);

const renderText = (value: string[]) => {
  return (
    <Text
      style={{
        flex: 1,
        color: "whitesmoke",
      }}
    >
      {
      value.join('、')
      }
    </Text>
  );
};

export function ReadingInput({
  title,
  onInputChange,
  value,
  readOnly = false,
}: {
  value: string[];
  title: string;
  onInputChange: (value: any) => void;
  readOnly?: boolean;
}) {
  const [isError, setIsError] = useState(false);

  const handleInputChange = (newReadings: string) => {
    if (newReadings === "") {
      onInputChange([])
      return
    }
    const arr = newReadings
      .split(/[\s,;\u3000\u3001\u3002]+/)
      // .filter((char) => char !== "");
    setIsError(!validateReadings(newReadings) && arr.length !== 0);
    onInputChange(arr);
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
        {readOnly
          ? renderText(value)
          : renderInput({
              value,
              onChangeText: handleInputChange,
              error: isError,
            })}
      </View>
      {isError && (
        <Text style={{ color: "red", marginTop: 8 }}>
          Can only contain hiragana or katakana
        </Text>
      )}
    </>
  );
}
