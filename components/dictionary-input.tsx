import { useState } from "react";
import { DictionaryEntry, DictionaryEntryInput } from "./dictionary-entry-input";
import { View } from "react-native";

const defaultEntry: DictionaryEntry = {
  word: "",
  reading: "",
  meaning: ""
}

export function DictionaryInput({
  kanji,
  dictionaryEntries,
}: {
  kanji: string,
  dictionaryEntries: DictionaryEntry[];
}) {
  const [entries, setEntries] = useState(dictionaryEntries);
  return (
    <View>
      {entries.map((entry) => (<DictionaryEntryInput kanji={kanji} fieldValues={entry} />))}
    </View>
  )
}
