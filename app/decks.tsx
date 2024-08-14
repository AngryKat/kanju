import { Card } from "@/components/card";
import { DeckKanjiCard } from "@/components/deck-kanji-card";
import { getDeckKanjis, getDecks } from "@/utils/decks-async-storage";
import { getKanjiById } from "@/utils/kanji-async-storage";
import { Deck, Kanji } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, SafeAreaView, Pressable, Text, View } from "react-native";

const renderAddNewDeckCard = () => {
  return (
    <Pressable onPress={() => router.navigate('add-deck')}>
      <Card style={{ marginTop: 10 }}>
        <Text style={{ color: "whitesmoke" }}>
          New deck <Ionicons name="add" />
        </Text>
      </Card>
    </Pressable>
  );
};

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [openDeck, setOpenDeck] = useState("");

  useEffect(() => {
    const getDecksFromStorage = async () => {
      const storageDecks = await getDecks();
      setDecks(storageDecks);
    };
    getDecksFromStorage();
  }, []);

  const handleOpenDeck = async (id: string) => {
    setOpenDeck((prev) => (!!prev ? "" : id));
  };
  return (
    <>
      <SafeAreaView>
        <ScrollView>
          {decks.map((deck) => (
            <View key={deck.id}>
              <Pressable onPress={() => handleOpenDeck(deck.id)}>
                <Card>
                  <Text style={{ color: "whitesmoke" }}>{deck.title}</Text>
                </Card>
              </Pressable>
              {openDeck === deck.id && (
                <View
                  style={{
                    marginHorizontal: "auto",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                    alignSelf: "baseline",
                    maxWidth: "90%",
                    marginVertical: 10,
                  }}
                >
                  {deck.kanjiIds.map((kanjiId) => (
                    <DeckKanjiCard kanjiId={kanjiId} key={kanjiId} />
                  ))}
                </View>
              )}
            </View>
          ))}
          {renderAddNewDeckCard()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
