import { StyleSheet, Text, View } from "react-native";
import { FlipCard } from "./ui/flip-card";
import { router } from "expo-router";
import type { Kanji, Readings } from "@/utils/types";
import { ContextMenuView } from "react-native-ios-context-menu";
import { KanjiCardPreview } from "./kanji-card-preview";
import { KanjiCardActions } from "@/constants/enums";


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
            actionKey: KanjiCardActions.View,
            actionTitle: "View",
            icon: {
              type: 'IMAGE_SYSTEM',
              imageValue: {
                systemName: 'eye',
              },
            }
          },
          {
            actionKey: KanjiCardActions.Edit,
            actionTitle: "Edit",
            icon: {
              type: 'IMAGE_SYSTEM',
              imageValue: {
                systemName: 'pencil',
              },
            }
          },
          {
            actionKey: KanjiCardActions.Remove,
            actionTitle: "Remove",
            menuAttributes: ["destructive"],
            icon: {
              type: 'IMAGE_SYSTEM',
              imageValue: {
                systemName: 'trash',
              },
            }
          },
        ],
      }}
      onPressMenuItem={({ nativeEvent: { actionKey } }) => {
        const key = actionKey as (typeof KanjiCardActions)[keyof typeof KanjiCardActions];
        switch (key) {
          case KanjiCardActions.View:
            router.navigate(`(kanjis)/${kanji.id}`);
            break;
          case KanjiCardActions.Edit:
            router.navigate(`(kanjis)/${kanji.id}/edit`);
            break;
          case KanjiCardActions.Remove:
            onRemove(kanji.id);
            break;
          default:
            console.warn("No action provided for key ", key);
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
