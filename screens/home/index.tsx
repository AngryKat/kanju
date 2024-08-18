import {
  StyleSheet,
  View,
  SafeAreaView,
  LayoutAnimation,
  Text,
  Button,
  FlatList
} from "react-native";

import { KanjiCard } from "@/components/kanji-card";
import { AddCard } from "@/components/add-card";
import React, {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { getKanjis, removeKanjiById } from "@/utils/kanji-async-storage";
import { router, useFocusEffect, useNavigation } from "expo-router";
import type { Kanji } from "@/utils/types";
import { useSearchBar } from "@/hooks/use-search-bar";

export function KanjiListScreen() {
  const navigation = useNavigation();
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const searchedKanjis = useSearchBar(kanjiList, [
    "kanji",
    "readings.kun",
    "readings.on",
  ]);
  const getAllKanjis = useCallback(() => {
    try {
      const data = getKanjis();
      setKanjiList(Object.values(data));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllKanjis();
    }, [getAllKanjis])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "white" }}>{kanjiList.length}</Text>
          <Button title="+1" onPress={() => router.navigate("add-kanji")} />
        </View>
      ),
    });
  }, [navigation, kanjiList]);
  const handleRemove = async (kanjiId: string) => {
    await removeKanjiById(kanjiId);
    getAllKanjis();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <SafeAreaView>
      <FlatList
        numColumns={3}
        columnWrapperStyle={{
          gap: 8,
        }}
        contentContainerStyle={{
          gap: 8,
          flexGrow: 1,
          padding: 14,
        }}
        data={[...searchedKanjis, <AddCard key="add-card" />]}
        renderItem={({ item }) =>
          React.isValidElement(item) ? (
            item
          ) : (
            <KanjiCard kanji={item as Kanji} onRemove={handleRemove} />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
