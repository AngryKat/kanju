import { Animated, Pressable, Text } from "react-native";
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

const renderAddCard = (onPress: () => void, disabled: boolean) => (
  <Pressable onPress={onPress}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Ionicons
        name="add-circle-outline"
        size={20}
        color={disabled ? "#505050" : "#eb9234"}
      />
      <Text
        style={{
          fontSize: 18,
          color: disabled ? "#505050" : "#eb9234",
        }}
      >
        Add word
      </Text>
    </View>
  </Pressable>
);

import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TextInput } from "react-native";
import { Card } from "../ui/card";
import type { DictionaryEntry } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { validateKanji } from "./kanji-input";

interface Props {
  data: DictionaryEntry[];
  onUpdate: (updatedData: DictionaryEntry[]) => void;
  kanji: string;
}

export const DictionaryInput: React.FC<Props> = ({ kanji, data, onUpdate }) => {
  const [entries, setEntries] = useState<DictionaryEntriesById>({});

  useEffect(() => {
    setEntries(normalizeEntriesById(data));
  }, [data]);

  const emptyEntry = {
    word: kanji,
    reading: "",
    meaning: "",
  };

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
    if (!kanji) return;
    const updatedEntries = { ...entries };
    const newEntry: DictionaryEntry = {
      id: uuid.v4() as string,
      ...emptyEntry,
    };
    updatedEntries[newEntry.id] = newEntry;
    setEntries(updatedEntries);
  };

  const renderRightActions = (id: string) => (progress: any, dragX: any) => {
    const opacity = dragX.interpolate({
      inputRange: [-65, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <Animated.View
        style={[
          {
            marginBottom: 10,
            marginLeft: 8,
            opacity,
          },
        ]}
      >
        <Pressable
          onPress={() => handleRemove(id)}
          style={{
            flex: 1,
            backgroundColor: "red",
            padding: 14,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="trash-outline" size={32} color="white" />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <ScrollView>
      {Object.values(entries).length !== 0 &&
        Object.values(entries).map((entry) => (
          <Swipeable
            key={entry.id}
            renderRightActions={renderRightActions(entry.id)}
          >
            <Card style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View>
                  <TextInput
                    style={styles.readingTextInput}
                    placeholder="reading..."
                    value={entry.reading}
                    onChangeText={(text: string) =>
                      handleInputChange(entry.id, "reading", text)
                    }
                    onEndEditing={handleSave}
                  />
                  <TextInput
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
                  <TextInput
                    style={styles.meaningTextInput}
                    multiline
                    placeholder="meaning..."
                    value={entry.meaning}
                    onChangeText={(text: string) =>
                      handleInputChange(entry.id, "meaning", text)
                    }
                    onEndEditing={handleSave}
                  />
                </View>
              </View>
            </Card>
          </Swipeable>
        ))}
      {renderAddCard(handleAddDefault, !kanji || !validateKanji(kanji))}
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
    borderBottomColor: "#404040",
    paddingBottom: 4,
  },
  wordTextInput: {
    alignSelf: "center",
    color: "whitesmoke",
    paddingHorizontal: 12,
    borderRadius: 5,
    fontSize: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#404040",
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