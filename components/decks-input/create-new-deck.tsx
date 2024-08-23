import type { Deck } from "@/utils/types";
import { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import { Card } from "../ui/card";
import { TextInput } from "react-native-gesture-handler";
import { Button, View } from "react-native";

const NewDeckInput = ({
  onDeckAdd,
  onCancel,
}: {
  onDeckAdd: (title: string) => void;
  onCancel: () => void;
}) => {
  const [newDeckTitle, setNewDeckTitle] = useState("");
  return (
    <View>
      <Card>
        <TextInput
          style={{
            fontSize: 18,
            color: "whitesmoke",
            borderBottomWidth: 1,
            borderBottomColor: "#404040",
            paddingBottom: 6,
          }}
          onChangeText={setNewDeckTitle}
          autoFocus
        />
      </Card>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 18 }}>
        <Button title="Create" onPress={() => onDeckAdd(newDeckTitle)} />
        <Button color="red" title="Cancel" onPress={onCancel} />
      </View>
    </View>
  );
};

interface Props {
  onCreateNewDeck: (newDeck: Deck) => void;
  onCancel: () => void;
}

export function CreateNewDeck({ onCreateNewDeck, onCancel }: Props) {
  const handleNewDeckAdd = async (newTitle: string) => {
    const newDeck: Deck = {
      id: uuid.v4() as string,
      title: newTitle,
      kanjiIds: [],
    };
    onCreateNewDeck(newDeck);
  };

  return <NewDeckInput onDeckAdd={handleNewDeckAdd} onCancel={onCancel} />;
}
