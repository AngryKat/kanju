import { ActionSheetIOS, StyleSheet, Text, View } from "react-native";
import { FlipCard } from "./ui/flip-card";
import { router } from "expo-router";
import type { Kanji } from "@/utils/types";

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

export function KanjiCard({
  kanji,
  onRemove,
}: {
  kanji: Kanji;
  onRemove: (kanjiId: string) => void;
}) {
  const handleOnLongPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Read more...", "Edit", "Remove"],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            router.navigate(`(kanjis)/${kanji.id}`);
            break;
          case 2:
            router.navigate(`(kanjis)/${kanji.id}/edit`);
            break;
          case 3:
            onRemove(kanji.id);
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
