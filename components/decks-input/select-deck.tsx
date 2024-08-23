import { Button, View } from "react-native";

import React, { useCallback, useEffect, useState } from "react";
import { PickerIOS } from "@react-native-picker/picker";
import { getDecks } from "@/utils/decks-async-storage";
import { useFocusEffect } from "expo-router";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";
import { CreateNewDeck } from "./create-new-deck";
import type { Deck } from "@/utils/types";

interface Props {
  onSelect: (newDeck: Deck) => void;
  selectedDecks: string[];
}

export function SelectDeck({ onSelect, selectedDecks }: Props) {
  const [createNewDeck, setCreateNewDeck] = useState(false);

  const [visible, setVisible] = useState(false);
  const [decksList, setDecksList] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>("");
  const filteredDecks = decksList.filter(
    (deck) => !selectedDecks.includes(deck.id)
  );

  useFocusEffect(
    useCallback(() => {
      setDecksList(getDecks());
    }, [selectedDecks])
  );

  // useEffect(() => {
  //   setCreateNewDeck(false);
  // }, []);

  useEffect(() => {
    if (filteredDecks.length === 1) setSelectedDeck(filteredDecks[0].id);
  }, [filteredDecks]);

  // if (createNewDeck) {
  //   return (
  //     <CreateNewDeck
  //       onCancel={() => setCreateNewDeck(false)}
  //       onCreateNewDeck={(newDeck: Deck) => {
  //         onSelect(newDeck);
  //         setDecksList([newDeck]);
  //         setCreateNewDeck(false);
  //       }}
  //     />
  //   );
  // }

  const handleOnValueChange = (value: ItemValue) => {
    setSelectedDeck(value as string);
  };

  const handleDeckAdd = (id: string) => {
    const addedDeck = decksList.find((deck) => deck.id === id);
    if (addedDeck) {
      onSelect(addedDeck);
    } else {
      console.error("Could not get deck by id ", id);
    }
    setVisible(false);
  };
  return (
    <>
      {visible && (
        <PickerIOS
          itemStyle={{
            color: "whitesmoke",
          }}
          selectedValue={selectedDeck}
          onValueChange={handleOnValueChange}
        >
          {filteredDecks.map((deck) => {
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
            handleDeckAdd(selectedDeck);
          }}
        />
      ) : (
        <View>
          {/* <Button
            title="Create a new deck"
            onPress={() => setCreateNewDeck(true)}
          /> */}
          <Button title="Select deck" onPress={() => setVisible(true)} />
        </View>
      )}
    </>
  );
}
