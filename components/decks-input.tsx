import { Animated, Button, Pressable, Text } from "react-native";
import uuid from "react-native-uuid";

const renderAddCard = (onPress: () => void) => (
  <Pressable onPress={onPress}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Ionicons name="add-circle-outline" size={20} color="#505050" />
      <Text
        style={{
          fontSize: 18,
          color: "#505050",
        }}
      >
        Add word
      </Text>
    </View>
  </Pressable>
);

const DeckSelect = ({ onSelect, selectedDecks }: any) => {
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [createNewDeck, setCreateNewDeck] = useState(false);
  const [visible, setVisible] = useState(false);
  const [decksList, setDecksList] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>("");
  console.log({ decksList })
  useFocusEffect(
    useCallback(() => {
      setDecksList(
        getDecks().filter((deck) => !selectedDecks.includes(deck.id))
      );
    }, [selectedDecks])
  );
  if (decksList.length === 0) {
    return (
      <View>
        {!createNewDeck ? (
          <Button
            title="No decks to add! Create a new deck?"
            onPress={() => setCreateNewDeck(true)}
          />
        ) : (
          <Card>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "black",
              }}
              onChangeText={setNewDeckTitle}
            />
            <Button
              title="Create"
              onPress={async () => {
                const newDeck: Deck = {
                  id: uuid.v4() as string,
                  title: newDeckTitle,
                  kanjiIds: [],
                };
                await addDeck(newDeck);
                console.log({ newDeck });
                onSelect(newDeck.id);
                setDecksList([newDeck]);
                setCreateNewDeck(false);
              }}
            />
          </Card>
        )}
      </View>
    );
  }
  return (
    <>
      {visible && (
        <PickerIOS
          itemStyle={{
            color: "red",
          }}
          selectedValue={selectedDeck}
          onValueChange={(value) => setSelectedDeck(value as string)}
        >
          {decksList.map((deck) => {
            return (
              <PickerIOS.Item
                key={deck.id}
                label={deck.title}
                value={deck.id}
              />
            );
          })}
        </PickerIOS>
      )}
      {visible ? (
        <Button
          title="Add this deck"
          onPress={() => {
            console.log({ selectedDeck });
            onSelect(selectedDeck);
            setVisible(false);
          }}
        />
      ) : (
        <Button title="+ New deck" onPress={() => setVisible(true)} />
      )}
    </>
  );
};

import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { PickerIOS } from "@react-native-picker/picker";
import { addDeck, getDeck, getDecks } from "@/utils/decks-async-storage";
import { router, useFocusEffect } from "expo-router";
import { Deck } from "@/utils/types";
import { Card } from "./card";

interface Props {
  initDecks: string[];
  onUpdate: (updatedData: string[]) => void;
}

export const DecksInput: React.FC<Props> = ({ initDecks, onUpdate }) => {
  const [decks, setDecks] = useState<Map<string, string>>(new Map([]));
  useEffect(() => {
    const normalized = new Map(initDecks.map((id) => [id, id]));
    setDecks(normalized);
  }, [initDecks]);

  const handleInputChange = (id: string) => {
    console.log({ id });
    const updatedDecks = new Map(decks);
    updatedDecks.set(id, id);
    setDecks(updatedDecks);
    onUpdate([...decks.values()]);
  };

  const handleRemove = (id: string) => {
    const updatedDecks = new Map(decks);
    updatedDecks.delete(id);
    onUpdate([...updatedDecks.values()]);
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
      <Swipeable renderRightActions={renderRightActions("")}>
        {decks.size !== 0 &&
          [...decks.values()].map((id) => {
            console.log({ decks });
            return (
              <Card key={id}>
                <Text>{id}</Text>
              </Card>
            );
          })}
      </Swipeable>
      <DeckSelect
        onSelect={handleInputChange}
        selectedDecks={[...decks.values()]}
      />
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
