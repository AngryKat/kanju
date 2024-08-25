import { Button, Pressable, Text, View } from "react-native";

import React, { useCallback, useEffect, useState } from "react";
import { PickerIOS } from "@react-native-picker/picker";
import { getDecks } from "@/utils/decks-async-storage";
import { Link, useFocusEffect } from "expo-router";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";
import { CreateNewDeck } from "./create-new-deck";
import type { Deck } from "@/utils/types";
import { Controller, useWatch } from "react-hook-form";
import { Card } from "../ui/card";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onAdd: (id: string) => void;
}

export function SelectDeck({ onAdd }: Props) {
  const [visible, setVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<string>("");
  const selectedDecks: Deck[] = useWatch({ name: "decks" });

  const allDecks = getDecks();
  const filteredDecks = allDecks.filter(
    (deck) => !selectedDecks.find(({ id }) => id === deck.id)
  );

  useEffect(() => {
    if (filteredDecks.length === 1) setSelectedDeck(filteredDecks[0].id);
  }, [filteredDecks.length, filteredDecks[0]?.id]);

  if (filteredDecks.length === 0) {
    return (
      <Text
        style={{
          textAlign: "center",
          color: "#505050",
        }}
      >
        No decks to add to.{" "}
        <Link
          href={"(decks)/add-deck"}
          style={{
            color: "#eb9234",
          }}
        >
          Create new a deck.
        </Link>
      </Text>
    );
  }

  if (!visible) {
    return (
      <Pressable
        onPress={() => {
          setVisible(true);
          setSelectedDeck(filteredDecks[0].id);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 10,
        }}
      >
        <Ionicons name="add-circle-outline" size={20} color="#eb9234" />
        <Text style={{ color: "#eb9234", fontSize: 18 }}>Add to a deck</Text>
      </Pressable>
    );
  }

  const handleAdd = () => {
    onAdd(selectedDeck);
    setVisible(false);
  };

  return (
    <Card>
      <PickerIOS
        itemStyle={{
          color: "whitesmoke",
        }}
        selectedValue={selectedDeck}
        onValueChange={(value) => setSelectedDeck(value as string)}
      >
        {filteredDecks.map((deck) => {
          return (
            <PickerIOS.Item key={deck.id} label={deck.title} value={deck.id} />
          );
        })}
      </PickerIOS>
      <Button title="Add to this deck" onPress={handleAdd} />
    </Card>
  );
}
