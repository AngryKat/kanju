import {
  StyleSheet,
  View,
  SafeAreaView,
  LayoutAnimation,
  Text,
  Button,
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
import Animated from "react-native-reanimated";

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
  const navigation = useNavigation();
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const getAllKanjis = useCallback(async () => {
    setTimeout(async () => {
      const data = await getKanjis();
      setKanjiList(Object.values(data));
    }, 500);
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
          <Button title="+1" onPress={() => router.push("/add-kanji")} />
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
      <Animated.FlatList
        contentContainerStyle={{
          gap: 8,
          flexGrow: 1,
          padding: 14,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
        data={[...kanjiList, <AddCard key="add-card" />]}
        renderItem={({ item }) => renderListItem(item, handleRemove)}
        keyExtractor={(item) => (item as Kanji).id ?? "add-card"}
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
