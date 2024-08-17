import { DeckKanjiCard } from "@/components/deck-kanji-card";
import { useSearchBar } from "@/hooks/use-search-bar";
import { getDeck } from "@/utils/decks-async-storage";
import { getKanjiById } from "@/utils/kanji-async-storage";
import { Deck } from "@/utils/types";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";

export default function DeckByIdPage() {
  const navigation = useNavigation();
  const { deckId } = useLocalSearchParams();
  const [deck, setDeck] = useState<Deck>();
  const kanjis = useMemo(
    () => deck?.kanjiIds.map((id) => getKanjiById(id)),
    [deck]
  );
  const filteredKanjis = useSearchBar(kanjis || [], [
    "kanji",
    "readings.on",
    "readings.kun",
  ]);

  useFocusEffect(
    useCallback(() => {
      const storageDeck = getDeck(deckId as string);
      setDeck(storageDeck);
    }, [deckId])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Deck ${deck?.title}`,
    });
  }, [navigation, deck]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          alignSelf: "baseline",
          maxWidth: "90%",
          marginVertical: 10,
        }}
      >
        {filteredKanjis ? (
          filteredKanjis.map((kanji) => (
            <DeckKanjiCard kanji={kanji} key={kanji.id} />
          ))
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </SafeAreaView>
  );
}
