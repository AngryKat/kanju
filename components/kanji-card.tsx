import { StyleSheet, Text, View } from "react-native";
import { FlipCard } from "./ui/flip-card";
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

const styles = StyleSheet.create({
  readingNameText: { color: "#808080", fontWeight: 600, fontSize: 10 },
  readingText: {
    color: "whitesmoke",
    fontWeight: 400,
    fontSize: 16,
  },
});
