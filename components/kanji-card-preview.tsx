import type { Kanji } from "@/utils/types";
import { ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { Card } from "./ui/card";
import { DictionaryEntryRead } from "./dictionary-entry-read";

interface Props {
  kanji: Kanji;
}

export function KanjiCardPreview({ kanji }: Props) {
  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={{ padding: 14, paddingTop: 28 }}
    >
      <Card
        style={{
          alignSelf: "baseline",
          marginHorizontal: "auto",
          marginBottom: 10,
        }}
      >
        <TextInput
          value={kanji.kanji}
          readOnly
          style={{
            fontSize: 36,
            verticalAlign: "bottom",
            height: 50,
            width: 50,
            fontWeight: "500",
            textAlign: "center",
            paddingVertical: 8,
            color: "whitesmoke",
          }}
        />
      </Card>
      <Text style={styles.title}>Readings</Text>
      <Card>
        {kanji.readings.kun.length !== 0 && (
          <Text style={{ color: "whitesmoke" }}>
            kun: {`${kanji.readings.kun.join(", ")}`}
          </Text>
        )}
        {kanji.readings.on.length !== 0 && (
          <Text style={{ color: "whitesmoke" }}>
            on: {`${kanji.readings.on.join(", ")}`}
          </Text>
        )}
      </Card>
      {kanji.dictionary.length !== 0 && (
        <Text style={styles.title}>Dictionary</Text>
      )}
      {kanji.dictionary.map((entry) => (
        <DictionaryEntryRead key={entry.id} entry={entry} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  submitButtonContainer: {
    backgroundColor: "#eb9234",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 14,
    marginBottom: 14,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: 500,
    fontSize: 20,
  },
  title: {
    color: "whitesmoke",
    textAlign: "center",
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 18,
    marginTop: 24,
  },
});
