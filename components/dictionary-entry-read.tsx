import React from "react";
import { View, TextInput } from "react-native";
import { Card } from "./ui/card";
import { DictionaryEntry } from "@/utils/types";

interface DictionaryReadProps {
  entry: DictionaryEntry;
}

export const DictionaryEntryRead: React.FC<DictionaryReadProps> = ({
  entry,
}) => {
  return (
    <Card key={entry.id} style={{ marginBottom: 10, marginHorizontal: 14 }}>
      <View style={{ flexDirection: "row" }}>
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
          <View>
            <TextInput
              style={{
                textAlign: "center",
                alignSelf: "center",
                color: "whitesmoke",
                fontSize: 20,
              }}
              value={entry.word}
              readOnly
            />
          </View>
        </View>

        <View
          style={[
            {
              flex: 1,
              marginRight: 8,
              borderLeftWidth: 1,
              borderLeftColor: "#505050",
            },
          ]}
        >
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
  );
};
