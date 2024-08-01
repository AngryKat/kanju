import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  LayoutAnimation,
  FlatList,
} from "react-native";

import { KanjiCard } from "@/components/kanji-card";
import { AddCard } from "@/components/add-card";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import {
  addKanji,
  getKanjis,
  removeKanjiById,
  type Kanji,
} from "@/utils/kanji-async-storage";
import { useFocusEffect } from "expo-router";
import { RefreshControl } from "react-native-gesture-handler";

const renderListItem = (
  item: Kanji | ReactNode,
  onRemove: (id: string) => void
) => {
  if (React.isValidElement(item) && item.key === "add-card") {
    return item;
  }
  return <KanjiCard kanji={item as Kanji} onRemove={onRemove} />;
};

export function KanjiListScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const getAllKanjis = useCallback(async () => {
    setRefreshing(true);
    setTimeout(async () => {
      const data = await getKanjis();
      setKanjiList(Object.values(data));
      setRefreshing(false);
    }, 500);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllKanjis();
    }, [getAllKanjis])
  );

  const handleRemove = async (kanjiId: string) => {
    await removeKanjiById(kanjiId);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    getAllKanjis();
  };

  // const wrapAddCard = (index?: number) => if length is not %3 and index is last, show card

  return (
    <SafeAreaView>
      <View
        style={{
          padding: 14,
          gap: 8,
          height: '100%'
        }}
      >
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getAllKanjis} />
          }
          numColumns={3}
          contentContainerStyle={{
            gap: 8,
          }}
          columnWrapperStyle={{ gap: 8 }}
          data={[...kanjiList, <AddCard key="add-card" />]}
          renderItem={({ item }) => renderListItem(item, handleRemove)}
          keyExtractor={(item) =>
            React.isValidElement(item) && item.type === "AddCard"
              ? "add-card"
              : (item as Kanji).id
          }
        />
      </View>
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
