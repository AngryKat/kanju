import { DictionaryEntryRead } from "@/components/dictionary-entry-read";
import { useSearchBar } from "@/hooks/use-search-bar";
import { getDictionaryEntries } from "@/utils/kanji-async-storage";
import { DictionaryEntry } from "@/utils/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";

export default function DictionaryPage() {
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>(
    []
  );
  const searchedEntries = useSearchBar(dictionaryEntries, [
    "word",
    "reading",
    "meaning",
  ]);
  const getAllDictionaryEntries = useCallback(() => {
    try {
      const data = getDictionaryEntries();
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
    <SafeAreaView>
      <FlatList
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 10,
        }}
        data={searchedEntries}
        renderItem={({ item }) => <DictionaryEntryRead entry={item} />}
      />
    </SafeAreaView>
  );
}
