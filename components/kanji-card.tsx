import { ActionSheetIOS, Text, View } from "react-native";
import { FlipCard } from "./flip-card";
import { type Kanji } from "@/utils/kanji-async-storage";
import { router } from "expo-router";

interface Readings {
  kun: string[];
  on: string[];
}

const renderCardBack = (readings: Readings) => {
  const { on, kun } = readings;
  return (
    <View style={{ display: "flex", justifyContent: "space-evenly", flex: 1 }}>
      <Text style={{ color: "white", fontWeight: 600, fontSize: 14 }}>
        KUN:{" "}
        <Text
          style={{
            color: "whitesmoke",
            fontWeight: 400,
            fontSize: 12,
          }}
        >
          {kun.join(", ")}
        </Text>
      </Text>
      <Text style={{ color: "white", fontWeight: 600, fontSize: 14 }}>
        ON:{" "}
        <Text
          style={{
            color: "whitesmoke",
            fontWeight: 400,
            fontSize: 12,
          }}
        >
          {on.join(", ")}
        </Text>
      </Text>
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
            router.navigate(`/${kanji.id}`);
            break;
          case 2:
            router.navigate(`/${kanji.id}/edit`);
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
