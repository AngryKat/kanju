import { Controller, useWatch } from "react-hook-form";
import { Text, View } from "react-native";
import { SelectedDeckCard } from "./selected-deck-card";
import { SelectDeck } from "./select-deck";

interface Props {
  onRemove: () => void;
  selectedDecks: any;
}
export function SelectedDecksList({ onRemove, selectedDecks }: Props) {

  if (selectedDecks.length === 0)
    return (
      <Text
        style={{
          color: "#404040",
        }}
      >
        No decks selected
      </Text>
    );
  return (
    <View style={{ gap: 10, marginBottom: 10 }}>
      {selectedDecks.map((deck: any) => {
        return (
          <SelectedDeckCard key={deck.id} deck={deck} onRemove={onRemove} />
        );
      })}
    </View>
  );
}
