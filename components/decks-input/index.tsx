import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Button, TextInput } from "react-native";
import { Deck } from "@/utils/types";
import { SelectedDeckCard } from "./selected-deck-card";
import { SelectDeck } from "./select-deck";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { SelectedDecksList } from "./selected-decks-list";
import { getDeck } from "@/utils/decks-async-storage";

export function DecksInput() {
  const { fields, remove, append } = useFieldArray({
    name: "decks",
  });

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
      <SelectDeck onAdd={handleOnSelectDeckAdd} />
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
