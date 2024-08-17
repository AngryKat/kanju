import { Pressable, StyleSheet, Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { router } from "expo-router";
import type { Kanji } from "@/utils/types";
import { Card } from "./card";

export function SelectKanjiCard({
  kanji,
  onCheck,
  isChecked,
}: {
  kanji: Kanji;
  isChecked: boolean;
  onCheck: (
    kanjiId: Kanji["id"],
    kanji: Kanji["kanji"],
    isChecked: boolean
  ) => void;
}) {
  return (
    <Pressable onPress={() => onCheck(kanji.id, kanji.kanji, !isChecked)}>
      <Card style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "whitesmoke", fontSize: 24 }}>{kanji.kanji}</Text>
        <BouncyCheckbox
          size={18}
          isChecked={isChecked}
          onPress={(isCheckedInput) =>
            onCheck(kanji.id, kanji.kanji, isCheckedInput)
          }
        />
      </Card>
    </Pressable>
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
