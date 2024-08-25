import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { Card } from "./ui/card";
import { DictionaryEntry } from "@/utils/types";

interface DictionaryReadProps {
  entry: DictionaryEntry;
}

export const DictionaryEntryRead: React.FC<DictionaryReadProps> = ({
  entry,
}) => {
  return (
    <Card key={entry.id} style={{ marginBottom: 10 }}>
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
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: "#505050",
            marginRight: 8,
          }}
        />
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
  );
};
