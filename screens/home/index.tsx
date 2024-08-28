import {
  StyleSheet,
  View,
  SafeAreaView,
  LayoutAnimation,
  Text,
  Button,
  FlatList,
} from "react-native";

import { KanjiCard } from "@/components/kanji-card";
import { AddCard } from "@/components/add-card";
import {
  ContextMenuButton,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { getKanjiById, getKanjis } from "@/utils/kanji-async-storage";
import { router, useFocusEffect, useNavigation } from "expo-router";
import type { Kanji } from "@/utils/types";
import { useSearchBar } from "@/hooks/use-search-bar";
import { deleteKanji } from "@/utils/kanjis-decks-data-utils";
import { Ionicons } from "@expo/vector-icons";
import { getDeck, getDecks } from "@/utils/decks-async-storage";

const FilterByDeckButton = ({
  onMenuItemPress,
}: {
  onMenuItemPress: OnPressMenuItemEvent;
}) => {
  const decks = getDecks();

  if (decks.length === 0) return null;

  const menuItems = [
    { actionKey: "all", actionTitle: "All" },
    ...decks.map((deck) => ({
      actionKey: deck.id,
      actionTitle: deck.title,
    })),
  ];

  return (
    <ContextMenuButton
      onPressMenuItem={onMenuItemPress}
      menuConfig={{
        menuTitle: "Filter by deck",
        menuItems,
      }}
    >
      <Ionicons name="filter-sharp" color="#007FFF" size={16} />
    </ContextMenuButton>
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
      headerLeft: () => (
        <FilterByDeckButton
          onMenuItemPress={({ nativeEvent: { actionKey } }: any) => {
            if (actionKey === "all") {
              getAllKanjis();
              return;
            }
            const deck = getDeck(actionKey);
            setKanjiList((prev) => {
              if (!deck) return prev;
              return deck.kanjiIds
                .map((id) => getKanjiById(id))
                .filter((kanji) => !!kanji);
            });
          }}
        />
      ),
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
