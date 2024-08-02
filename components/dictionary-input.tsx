import uuid from "react-native-uuid";

interface DictionaryEntriesById {
  [id: string]: DictionaryEntry;
}

function normalizeEntriesById(data: DictionaryEntry[]) {
  return data.reduce((acc, entry) => {
    acc[entry.id] = entry;
    return acc;
  }, {} as DictionaryEntriesById);
}

import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Card } from "./card";
import { IonIconButton } from "./ionicon-button";
import type { DictionaryEntry } from "@/utils/types";

interface Props {
  data: DictionaryEntry[];
  onUpdate: (updatedData: DictionaryEntry[]) => void;
  kanji: string;
}

export const DictionaryInput: React.FC<Props> = ({
  kanji,
  data,
  onUpdate,
}) => {
  const [entries, setEntries] = useState<DictionaryEntriesById>(() =>
    normalizeEntriesById([...data])
  );

  const emptyEntry = {
    word: kanji,
    reading: "",
    meaning: "",
  }

  useEffect(() => {
    if (data.length > 0) return;
    const defaultEntry = {
      id: uuid.v4() as string,
      ...emptyEntry
    };
    setEntries({
      [defaultEntry.id]: defaultEntry,
    });
  }, [data]);

  const handleInputChange = (
    id: string,
    field: keyof DictionaryEntry,
    value: string
  ) => {
    const updatedEntries = { ...entries };
    updatedEntries[id][field] = value;
    setEntries(updatedEntries);
  };

  const handleSave = () => {
    onUpdate(Object.values(entries));
  };

  const handleRemove = (id: string) => {
    const updatedEntries = { ...entries };
    delete updatedEntries[id];
    if (Object.keys(updatedEntries).length === 0) {
      const newEntry: DictionaryEntry = {
        id: uuid.v4() as string,
        ...emptyEntry,
      };
      updatedEntries[newEntry.id] = newEntry;
    }
    setEntries(updatedEntries);
    onUpdate(Object.values(updatedEntries));
  };

  const handleAddDefault = () => {
    const updatedEntries = { ...entries };
    const newEntry: DictionaryEntry = {
      id: uuid.v4() as string,
      ...emptyEntry
    };
    updatedEntries[newEntry.id] = newEntry;
    setEntries(updatedEntries);
  };

  const handleFocus = (id: string) => {
    const entriesArray = Object.values(entries);
    if (
      entriesArray.length > 0 &&
      id === entriesArray[entriesArray.length - 1].id
    ) {
      handleAddDefault();
    }
  };

  const handleClear = (id: string) => {
    const updatedEntries = { ...entries };
    updatedEntries[id] = {
      id,
      ...emptyEntry
    };
    setEntries(updatedEntries);
  };

  return (
    <ScrollView>
      {Object.values(entries).length !== 0 &&
        Object.values(entries).map((entry) => (
          <Card key={entry.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View>
                <TextInput
                  style={styles.readingTextInput}
                  placeholder="reading..."
                  onFocus={() => handleFocus(entry.id)}
                  value={entry.reading}
                  onChangeText={(text: string) =>
                    handleInputChange(entry.id, "reading", text)
                  }
                  onEndEditing={handleSave}
                />
                <TextInput
                  onFocus={() => handleFocus(entry.id)}
                  style={styles.wordTextInput}
                  value={entry.word}
                  onChangeText={(text: string) => {
                    if (text.includes(kanji))
                      handleInputChange(entry.id, "word", text);
                  }}
                  onEndEditing={handleSave}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.actionButtonsContainer}>
                  <IonIconButton
                    style={styles.actionButton}
                    name="refresh"
                    onPress={() => handleClear(entry.id)}
                  />

                  <IonIconButton
                    style={styles.actionButton}
                    name="trash-outline"
                    onPress={() => handleRemove(entry.id)}
                  />
                </View>

                <TextInput
                  style={styles.meaningTextInput}
                  multiline
                  placeholder="meaning..."
                  onFocus={() => handleFocus(entry.id)}
                  value={entry.meaning}
                  onChangeText={(text: string) =>
                    handleInputChange(entry.id, "meaning", text)
                  }
                  onEndEditing={handleSave}
                />
              </View>
            </View>
          </Card>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  meaningTextInput: {
    flex: 1,
    padding: 8,
    color: "whitesmoke",
    borderWidth: 1,
    borderColor: "#404040",
    borderRadius: 8,
  },
  readingTextInput: {
    alignSelf: "center",
    color: "lightgray",
    paddingHorizontal: 8,
    borderRadius: 5,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "darkgray",
    paddingBottom: 4,
  },
  wordTextInput: {
    alignSelf: "center",
    color: "whitesmoke",
    paddingHorizontal: 12,
    borderRadius: 5,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "darkgray",
    paddingVertical: 4,
  },
  actionButton: {
    paddingBottom: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 8,
  },
});
