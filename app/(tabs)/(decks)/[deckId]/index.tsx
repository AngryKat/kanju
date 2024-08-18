import { DeckKanjiCard } from "@/components/deck-kanji-card";
import { useSearchBar } from "@/hooks/use-search-bar";
import { getDeck } from "@/utils/decks-async-storage";
import { getKanjiById } from "@/utils/kanji-async-storage";
import { Deck } from "@/utils/types";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  ScrollView,
} from "react-native";

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
      headerRight: () => (
        <Button title="Edit" onPress={() => router.push(`/${deckId}/edit`)} />
      ),
    });
  }, [navigation, deck, deckId]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          alignSelf: "baseline",
          marginVertical: 10,
          padding: 10,
        }}
      >
        {filteredKanjis ? (
          filteredKanjis.map((kanji) => (
            <DeckKanjiCard kanji={kanji} key={kanji.id} />
          ))
        ) : (
          <ActivityIndicator />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
