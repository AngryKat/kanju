import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlipCard } from "./ui/flip-card";
import { router } from "expo-router";
import type { Kanji, Readings } from "@/utils/types";
import { ContextMenuView } from "react-native-ios-context-menu";
import { KanjiCardPreview } from "./kanji-card-preview";
import { DeckKanjiCardActions, KanjiCardActions } from "@/constants/enums";


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
  return (
    <ContextMenuView
      previewConfig={{
        previewType: "CUSTOM",
        previewSize: "STRETCH",
        backgroundColor: "black",
      }}
      renderPreview={() => {
        return <KanjiCardPreview kanji={kanji} />;
      }}
      menuConfig={{
        menuTitle: "",
        menuItems: [
          {
            actionKey: DeckKanjiCardActions.View,
            actionTitle: "View",
          },
          {
            actionKey: DeckKanjiCardActions.Edit,
            actionTitle: "Edit",
          },
          {
            actionKey: DeckKanjiCardActions.Remove,
            actionTitle: "Remove",
            menuAttributes: ["destructive"],
          },
          {
            actionKey: DeckKanjiCardActions.RemoveFromDeck,
            actionTitle: "Remove from the deck",
            menuAttributes: ["destructive"],
          },
        ],
      }}
      onPressMenuItem={({ nativeEvent }) => {
        switch (nativeEvent.actionKey) {
          case DeckKanjiCardActions.View:
            router.navigate(`(kanjis)/${kanji.id}`);
            break;
          case DeckKanjiCardActions.Edit:
            router.navigate(`(kanjis)/${kanji.id}/edit`);
            break;
          case DeckKanjiCardActions.Remove:
            onRemoveKanji(kanji.id);
            break;
          case DeckKanjiCardActions.RemoveFromDeck:
            onRemoveKanjiFromDeck(kanji.id);
            break;
          default:
            console.warn(
              "No action provided for key ",
              nativeEvent.actionKey
            );
        }
      }}
    >
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
      />
    </ContextMenuView>
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
