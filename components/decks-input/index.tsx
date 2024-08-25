import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SelectedDeckCard } from "./selected-deck-card";
import { SelectDeck } from "./select-deck";
import {
  Controller,
  useFieldArray,
} from "react-hook-form";
import { getDeck } from "@/utils/decks-async-storage";
import { useKanjiPageContext } from "../kanji-page-layout/kanji-page-context";

export function DecksInput() {
  const { mode } = useKanjiPageContext();
  const { fields, remove, append } = useFieldArray({
    name: "decks",
  });

  if (mode === "read" && fields.length === 0) {
    return (
      <Text
        style={{
          color: "#a0a0a0",
          textAlign: 'center',
        }}
      >
        This kanji is not in any deck
      </Text>
    );
  }

  const handleOnSelectDeckAdd = (deckId: string) => {
    const deck = getDeck(deckId);
    if (!deck) {
      console.error("Could not find deck with id ", deckId);
      return;
    }
    append(deck);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        marginHorizontal: 14,
      }}
    >
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          name={`decks.${index}`}
          render={({ field: { value } }) => {
            console.log({ value });
            return (
              <SelectedDeckCard deck={value} onRemove={() => remove(index)} />
            );
          }}
        />
      ))}
      {mode !== "read" && <SelectDeck onAdd={handleOnSelectDeckAdd} />}
    </ScrollView>
  );
}

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
