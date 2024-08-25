import { DeckKanjiCard } from "@/components/deck-kanji-card";
import { useSearchBar } from "@/hooks/use-search-bar";
import { getDeck } from "@/utils/decks-async-storage";
import { getKanjiById } from "@/utils/kanji-async-storage";
import {
  deleteKanji,
  deleteKanjiFromDeck,
} from "@/utils/kanjis-decks-data-utils";
import { Deck, Kanji } from "@/utils/types";
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
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function DeckByIdPage() {
  const navigation = useNavigation();
  const { deckId } = useLocalSearchParams();
  const [deck, setDeck] = useState<Deck>();
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);

  const getDeckKanjis = () => {
    const storageDeck = getDeck(deckId as string);
    return storageDeck
      ? storageDeck.kanjiIds.map((id) => getKanjiById(id)).filter((id) => !!id)
      : [];
  };

  const filteredKanjis = useSearchBar(kanjiList, [
    "kanji",
    "readings.on",
    "readings.kun",
  ]);

  useFocusEffect(
    useCallback(() => {
      const storageDeck = getDeck(deckId as string);
      setDeck(storageDeck);
      const kanjis = getDeckKanjis();
      setKanjiList(kanjis);
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

  const handleDeleteKanji = async (kanjiId: string) => {
    await deleteKanji(kanjiId);
    // getKanjis();
    const kanjis = getDeckKanjis();
    setKanjiList(kanjis);
  };

  const handleDeleteKanjiFromDeck = async (kanjiId: string) => {
    await deleteKanjiFromDeck(kanjiId, deckId as string);
    // getKanjis();
    const kanjis = getDeckKanjis();

    setKanjiList(kanjis);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {filteredKanjis ? (
        <FlatList
          numColumns={3}
          columnWrapperStyle={{
            gap: 10,
          }}
          contentContainerStyle={{
            gap: 10,
            alignSelf: "baseline",
            marginVertical: 10,
            padding: 10,
          }}
          data={filteredKanjis}
          renderItem={({ item }) => (
            <DeckKanjiCard
              kanji={item}
              key={item.id}
              onRemoveKanji={handleDeleteKanji}
              onRemoveKanjiFromDeck={handleDeleteKanjiFromDeck}
            />
          )}
        />
      ) : (
        <ActivityIndicator />
      )}
    </SafeAreaView>
  );
}
