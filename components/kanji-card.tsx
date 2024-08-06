import { ActionSheetIOS, Text, View } from "react-native";
import { FlipCard } from "./flip-card";
import { router } from "expo-router";
import type { Kanji } from "@/utils/types";

interface Readings {
  kun: string[];
  on: string[];
}

const renderCardBack = (readings: Readings) => {
  const { on, kun } = readings;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white", fontWeight: 500, fontSize: 12 }}>
        kun:{" "}
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
      <Text style={{ color: "white", fontWeight: 500, fontSize: 12 }}>
        on:{" "}
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
}: {
  kanji: Kanji;
}) {

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
    />
  );
}
