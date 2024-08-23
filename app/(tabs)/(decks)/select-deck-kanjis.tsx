import { Card } from "@/components/ui/card";
import { SelectKanjiCard } from "@/components/select-kanji-card";
import { useSearchBar } from "@/hooks/use-search-bar";
import { addDeck, editDeck, getDeckKanjis } from "@/utils/decks-async-storage";
import { getKanjis } from "@/utils/kanji-async-storage";
import { Kanji } from "@/utils/types";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import uuid from "react-native-uuid";
const { v4: uuidv4 } = uuid;
import {
  Pressable,
  FlatList,
  SafeAreaView,
  Text,
  View,
  TextInput,
  Button,
  Keyboard,
} from "react-native";

export default function SelectDeckKanjisPage() {
  const navigation = useNavigation();
  const { title, deckId } = useLocalSearchParams();
  const [kanjis, setKanjis] = useState<Kanji[]>([]);
  const [checkedKanjis, setCheckedKanjis] = useState<Map<string, string>>(
    new Map()
  );

  const filteredKanjis = useSearchBar(kanjis, [
    "kanji",
    "readings.on",
    "readings.kun",
  ]);
  const kanjisFromStorage = getKanjis();
  useEffect(() => {
    if (!kanjisFromStorage) return;
    setKanjis(
      Object.values(kanjisFromStorage).sort((kanjiA, kanjiB) => {
        if (checkedKanjis.has(kanjiA.id) && checkedKanjis.has(kanjiB.id))
          return 0;
        if (checkedKanjis.has(kanjiA.id)) return -1;
        return 1;
      })
    );
  }, [kanjisFromStorage, checkedKanjis]);

  useEffect(() => {
    if (!deckId) return;
    const deckKanjis = getDeckKanjis(deckId as string);
    setCheckedKanjis(
      new Map(
        deckKanjis?.map((kanjiId) => [
          kanjiId,
          kanjisFromStorage[kanjiId].kanji,
        ]) ?? []
      )
    );
  }, [deckId, kanjisFromStorage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Kanjis for the deck ${title}`,
      headerBackTitle: "Back",
    });
  }, [navigation, title]);

  const handleOnCheck = (
    kanjiId: string,
    kanji: string,
    isChecked: boolean
  ) => {
    const updatedMap = new Map(checkedKanjis);
    if (isChecked) {
      updatedMap.set(kanjiId, kanji);
    } else {
      updatedMap.delete(kanjiId);
    }
    setCheckedKanjis(updatedMap);
  };

  const handleSubmit = async () => {
    const newDeck = {
      title: title as string,
      kanjiIds: [...checkedKanjis.keys()],
    };
    if (deckId) {
      await editDeck(deckId as string, {
        ...newDeck,
      });
    } else {
      await addDeck({ id: uuidv4() as string, ...newDeck });
    }
    router.navigate("(decks)");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingBottom: 10, flex: 0.7 }}>
        <FlatList
          contentContainerStyle={{
            gap: 8,
            paddingHorizontal: 14,
            paddingTop: 8,
          }}
          data={filteredKanjis}
          renderItem={({ item }) => (
            <SelectKanjiCard
              kanji={item}
              onCheck={handleOnCheck}
              isChecked={checkedKanjis.has(item.id)}
            />
          )}
        />
      </View>
      <Pressable
        style={{
          flex: 0.3,
          margin: 10,
          padding: 10,
          marginTop: 0,
          paddingTop: 0,
        }}
      >
        <View style={{ marginLeft: "auto" }}>
          <Button
            title="Clear selection"
            onPress={() => setCheckedKanjis(new Map([]))}
          />
        </View>

        <Card>
          <TextInput
            style={{ color: "whitesmoke", fontSize: 16, height: 40 }}
            value={[...checkedKanjis.values()].join(" ")}
            readOnly
            multiline
          />
        </Card>
        <Pressable
          style={{
            backgroundColor: "#eb9234",
            padding: 14,
            borderRadius: 12,
            marginTop: 10,
          }}
          onPress={handleSubmit}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: 500,
              fontSize: 20,
            }}
          >
            Submit
          </Text>
        </Pressable>
      </Pressable>
    </SafeAreaView>
  );
}
