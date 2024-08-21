import {
  ActionSheetIOS,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlipCard } from "./flip-card";
import { router, useLocalSearchParams } from "expo-router";
import type { Kanji } from "@/utils/types";
import { useEffect, useState } from "react";
import { getKanjiById } from "@/utils/kanji-async-storage";
import {
  deleteKanji,
  deleteKanjiFromDeck,
} from "@/utils/kanjis-decks-data-utils";

interface Readings {
  kun: string[];
  on: string[];
}

const renderCardBack = (readings: Readings) => {
  const { on, kun } = readings;
  return (
    <View style={{ display: "flex", justifyContent: "space-evenly", flex: 1 }}>
      {kun.length !== 0 && (
        <Text style={styles.readingNameText}>
          KUN: <Text style={styles.readingText}>{kun.join(", ")}</Text>
        </Text>
      )}
      {on.length !== 0 && (
        <Text style={styles.readingNameText}>
          ON: <Text style={styles.readingText}>{on.join(", ")}</Text>
        </Text>
      )}
    </View>
  );
};

export function DeckKanjiCard({
  kanji,
  onRemoveKanji,
  onRemoveKanjiFromDeck,
}: {
  kanji: Kanji;
  onRemoveKanji: (kanjiId: string) => void;
  onRemoveKanjiFromDeck: (kanjiId: string) => void;
}) {
  if (!kanji) {
    return (
      <FlipCard
        cardFront={
          <Text
            style={{
              color: "whitesmoke",
              fontWeight: "500",
              fontSize: 42,
              textAlign: "center",
            }}
          >
            <ActivityIndicator />
          </Text>
        }
        cardBack={
          <Text
            style={{
              color: "whitesmoke",
              fontWeight: "500",
              fontSize: 42,
              textAlign: "center",
            }}
          >
            <ActivityIndicator />
          </Text>
        }
        onLongPress={() => {}}
      />
    );
  }

  const handleOnLongPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          "Cancel",
          "Read more...",
          "Edit",
          "Remove",
          "Remove from deck",
        ],
        destructiveButtonIndex: [3, 4],
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            break;
          case 1:
            router.navigate(`(kanjis)/${kanji.id}`);
            break;
          case 2:
            router.navigate(`(kanjis)/${kanji.id}/edit`);
            break;
          case 3:
            onRemoveKanji(kanji.id);
            break;
          case 4:
            onRemoveKanjiFromDeck(kanji.id);
            break;
          default:
            console.warn("No action provided for index ", buttonIndex);
        }
      }
    );
  };

  return (
    <FlipCard
      cardFront={
        <Text
          style={{
            color: "whitesmoke",
            fontWeight: "500",
            fontSize: 42,
            textAlign: "center",
          }}
        >
          {kanji.kanji}
        </Text>
      }
      cardBack={
        <Text
          style={{
            color: "whitesmoke",
            fontWeight: "500",
            fontSize: 42,
            textAlign: "center",
          }}
        >
          {renderCardBack(kanji.readings)}
        </Text>
      }
      onLongPress={handleOnLongPress}
    />
  );
}

const styles = StyleSheet.create({
  readingNameText: { color: "#808080", fontWeight: 600, fontSize: 10 },
  readingText: {
    color: "whitesmoke",
    fontWeight: 400,
    fontSize: 16,
  },
});
