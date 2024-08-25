import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Deck } from "@/utils/types";
import { SelectedDeckCard } from "./selected-deck-card";
import { SelectDeck } from "./select-deck";

interface Props {
  initDecks: Deck[];
  onUpdate: (updatedData: Deck[]) => void;
}

export const DecksInput: React.FC<Props> = ({ initDecks, onUpdate }) => {
  const [selectedDecks, setSelectedDecks] = useState<Map<string, Deck>>(
    new Map([])
  );
  useEffect(() => {
    const normalized = new Map(initDecks.map((deck) => [deck.id, deck]));
    setSelectedDecks(normalized);
  }, [initDecks]);

  const handleInputChange = (deck: Deck) => {
    const updatedDecks = new Map(selectedDecks);
    updatedDecks.set(deck.id, deck);
    setSelectedDecks(updatedDecks);
    onUpdate([...updatedDecks.values()]);
  };

  const handleRemove = (id: string) => {
    const updatedDecks = new Map(selectedDecks);
    updatedDecks.delete(id);
    setSelectedDecks(updatedDecks);
    onUpdate([...updatedDecks.values()]);
  };

  return (
    <ScrollView>
      {selectedDecks.size !== 0 && (
        <View style={{ gap: 10, marginBottom: 10 }}>
          {[...selectedDecks.values()].map((deck) => {
            return (
              <SelectedDeckCard
                key={deck.id}
                deck={deck}
                onRemove={handleRemove}
              />
            );
          })}
        </View>
      )}
      <SelectDeck
        onSelect={handleInputChange}
        selectedDecks={[...selectedDecks.keys()]}
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
