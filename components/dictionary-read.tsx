import React, { useMemo } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { Card } from "./card";
import { DictionaryEntry } from "@/utils/types";

interface DictionaryReadProps {
  data: DictionaryEntry[];
}

export const DictionaryRead: React.FC<DictionaryReadProps> = ({ data }) => {
  const withMeaning = useMemo(() => {
    return data.filter((entry) => entry.meaning.length > 0);
  }, [data]);
  return (
    <ScrollView>
      {withMeaning.length !== 0 &&
        withMeaning.map((entry) => (
          <Card key={entry.id} style={{ marginBottom: 10 }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={{ marginRight: 8 }}>
                {entry.reading && (
                  <TextInput
                    style={{
                      alignSelf: "center",
                      color: "lightgray",
                      paddingHorizontal: 4,
                      fontSize: 12,
                    }}
                    value={entry.reading}
                    readOnly
                  />
                )}
                <TextInput
                  style={{
                    alignSelf: "center",
                    color: "whitesmoke",
                    paddingHorizontal: 12,
                    fontSize: 20,
                  }}
                  value={entry.word}
                  readOnly
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={{
                    flex: 1,
                    padding: 8,
                    color: "whitesmoke",
                  }}
                  multiline
                  placeholder="meaning..."
                  value={entry.meaning}
                  readOnly
                />
              </View>
            </View>
          </Card>
        ))}
    </ScrollView>
  );
};
