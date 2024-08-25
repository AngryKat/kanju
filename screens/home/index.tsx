import {
  StyleSheet,
  View,
  SafeAreaView,
  LayoutAnimation,
  Text,
  Button,
  FlatList
} from "react-native";

import { AddCard } from "@/components/add-card";
import React, {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { getKanjis } from "@/utils/kanji-async-storage";
import { router, useFocusEffect, useNavigation } from "expo-router";
import type { Kanji } from "@/utils/types";
import ContextMenu from "react-native-context-menu-view";
import { KanjiPageMinimizedPreview } from "@/components/kanji-page-minimized-preview";

import { useSearchBar } from "@/hooks/use-search-bar";
import { deleteKanji } from "@/utils/kanjis-decks-data-utils";
import { KanjiCard } from "@/components/kanji-card";


const renderListItem = (
  item: Kanji | ReactNode,
  onRemove: (id: string) => void
) => {
  if (React.isValidElement(item) && item.key === "add-card") {
    return item;
  }
  return (
    <ContextMenu
      actions={[
        { title: "View", systemIcon: "eye" },
        { title: "Edit", systemIcon: "square.and.pencil" },
        { title: "Remove", destructive: true },
      ]}
      preview={<KanjiPageMinimizedPreview kanji={item as Kanji} />}
      onPreviewPress={() => router.navigate(`/${(item as Kanji).id}`)}
      onPress={(e) => {
        switch (e.nativeEvent.index) {
          case 0:
            router.navigate(`/${(item as Kanji).id}`);
            break;
          case 1:
            router.navigate(`/${(item as Kanji).id}/edit`);
            break;
          case 2:
            onRemove((item as Kanji).id);
            break;
          default:
            console.warn("No action provided for index ", e.nativeEvent.index);
        }
      }}
    >
      <KanjiCard kanji={item as Kanji} />
    </ContextMenu>
  );
};

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
    await deleteKanji(kanjiId);
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
            <KanjiCard kanji={item as Kanji} />
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
