import { DictionaryEntryRead } from "@/components/dictionary-entry-read";
import { getDictionaryEntries } from "@/utils/kanji-async-storage";
import { DictionaryEntry } from "@/utils/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList } from "react-native";

export default function DictionaryPage() {
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>(
    []
  );
  const getAllDictionaryEntries = useCallback(async () => {
    try {
      const data = await getDictionaryEntries();
      setDictionaryEntries(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllDictionaryEntries();
    }, [getAllDictionaryEntries])
  );

  return (
    <FlatList
      contentContainerStyle={{
        paddingVertical: 16,
        paddingHorizontal: 10
      }}
      data={dictionaryEntries}
      renderItem={({ item }) => (
        <DictionaryEntryRead key={item.id} entry={item} />
      )}
    />
  );
}
