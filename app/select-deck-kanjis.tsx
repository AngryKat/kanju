import { Card } from "@/components/card";
import { SelectKanjiCard } from "@/components/select-kanji-card";
import { useSearchBar } from "@/hooks/use-search-bar";
import { getKanjis } from "@/utils/kanji-async-storage";
import { Kanji } from "@/utils/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Pressable,
  FlatList,
  SafeAreaView,
  Text,
  View,
  TextInput,
  Button,
} from "react-native";

export default function SelectDeckKanjisPage() {
  const navigation = useNavigation();
  const { title } = useLocalSearchParams();
  const [kanjis, setKanjis] = useState<Kanji[]>([]);
  const [checkedKanjis, setCheckedKanjis] = useState<
    Map<Kanji["id"], Kanji["kanji"]>
  >(new Map());
  const filteredKanjis = useSearchBar(kanjis, [
    "kanji",
    "readings.on",
    "readings.kun",
  ]);
  useEffect(() => {
    const kanjisFromStorage = getKanjis();
    setKanjis(Object.values(kanjisFromStorage));
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Select kanjis for deck ${title}`,
    });
  });

  console.log({ checkedKanjis });

  const handleOnCheck = (
    kanjiId: Kanji["id"],
    kanji: Kanji["kanji"],
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingBottom: 10, flex: 0.7 }}>
        <FlatList
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 6,
            paddingHorizontal: 14,
            paddingTop: 8,
          }}
          // data={[...kanjis, ...kanjis]}
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
      <View
        style={{ flex: 0.3, margin: 10, padding: 10, marginTop: 0, gap: 16 }}
      >
        <View>
          <Text
            style={{ color: "whitesmoke", textAlign: "center", fontSize: 18 }}
          >
            Kanjis added to the deck
          </Text>
          <Card
            style={{
              marginTop: 10,
            }}
          >
            <TextInput
              style={{ color: "whitesmoke", fontSize: 16, height: 40 }}
              value={[...checkedKanjis.values()].join(" ")}
              readOnly
              multiline
            />
          </Card>
        </View>
        <Pressable
          style={{
            backgroundColor: "#eb9234",
            padding: 14,
            borderRadius: 12,
          }}
          onPress={() =>
            console.log("New deck ", {
              title,
              kanjis: [...checkedKanjis.keys()],
            })
          }
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: 500,
              fontSize: 20,
            }}
          >
            Create deck
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
