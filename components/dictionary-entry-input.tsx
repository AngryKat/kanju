import { useState } from "react";
import { TextInput, View, Text, Button, Pressable } from "react-native";

export interface DictionaryEntry {
  word: string;
  reading: string;
  meaning: string;
}

export function DictionaryEntryInput({
  kanji,
  fieldValues,
}: {
  kanji: string;
  fieldValues?: DictionaryEntry;
}) {
  const [word, setWord] = useState(fieldValues?.word ?? kanji);
  const handleWordInput = (inputValue: string) => {
    if (!inputValue.includes(kanji)) return;
    setWord(inputValue);
  };
  return (
    <View>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TextInput
          placeholder="word"
          value={word}
          onChangeText={handleWordInput}
        />
        {" - "}
        <TextInput placeholder="reading" value={fieldValues?.reading} />
        <Text
          style={{
            color: "lightgray",
            fontSize: 12,
          }}
        >{`(Will be displayed at the top of the word)`}</Text>
      </View>
      <TextInput placeholder="meaning..." multiline value={fieldValues?.meaning} />
    </View>
  );
}
