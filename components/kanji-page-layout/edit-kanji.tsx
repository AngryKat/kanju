import type { Deck, FormData, Kanji } from "@/utils/types";
import { useLayoutEffect, useRef, useState } from "react";
import { KanjiInput, validateKanji } from "../kanji-input";
import { ReadingInput, validateReadings } from "../reading-input";
import { addKanji, editKanji } from "@/utils/kanji-async-storage";
import { autoAdd } from "./auto-add-util";
import { router, useNavigation } from "expo-router";
import {
  View,
  ScrollView,
  Text,
  Pressable,
  Keyboard,
  Button,
  StyleSheet,
} from "react-native";
import { Card } from "../card";
import { DictionaryField } from "./dictionary-field";
import { NotesInput } from "../notes-input";
import { DecksField } from "./decks-field";
import { getKanjiDecks } from "@/utils/kanjis-decks-data-utils";
import { addDeck, editDeck, getDecks } from "@/utils/decks-async-storage";

const editDecks = ({ kanjiId, decks }: { kanjiId: string, decks: Deck[] }) => {
  const removedDecks = getKanjiDecks(kanjiId).filter(
    (deck) => !decks.find(({ id }) => deck.id !== id)
  );
  console.log("HELLO!!!", { decks, removedDecks });
  const storageDecksIds = getDecks().map(({ id }) => id);
  decks.forEach(async (deck) => {
    // if (!storageDecksIds.includes(deck.id)) {
    //   await addDeck(deck);
    // }
    await editDeck(deck.id, {
      kanjiIds: [...new Set([...deck.kanjiIds, kanjiId])],
    });
  });
  removedDecks.forEach(async (deck) => {
    await editDeck(deck.id, {
      kanjiIds: deck.kanjiIds.filter((id) => kanjiId !== id),
    });
  });
}

export function EditKanji({ kanji }: { kanji: Kanji }) {
  const { id, kanji: initKanjiString, readings, notes, dictionary } = kanji;
  const [isValid, setIsValid] = useState(true);
  const navigation = useNavigation();
  const formData = useRef<FormData>({
    kanji: initKanjiString,
    notes,
    dictionary,
    ...readings,
  } as FormData);

  const handleSubmit = async () => {
    if (!isValid) return;
    const { on, kun, notes, dictionary } = formData.current;

    const newKanji = {
      readings: {
        on,
        kun,
      },
      notes,
      dictionary,
    } as Kanji;
    await editKanji(id, newKanji);
    // editDecks()
    autoAdd(newKanji);
    router.navigate("(kanjis)");
  };

  const handleFieldInput = (fieldName: keyof FormData) => (value: any) => {
    formData.current = {
      ...formData.current,
      [fieldName]: value,
    };

    if (["kun", "on"].includes(fieldName)) {
      const kanjiValid = validateKanji(formData.current.kanji);
      setIsValid(kanjiValid && value.length !== 0 && validateReadings(value));
    }
    if (fieldName === "kanji") {
      const readingsValid = validateReadings(
        formData.current.on.concat(formData.current.kun).join(" ")
      );
      setIsValid(readingsValid && value.length <= 1 && validateKanji(value));
    }
  };

  useLayoutEffect(() => {
    const options = {
      title: `Edit ${initKanjiString}`,
      headerRight: () => <Button onPress={handleSubmit} title="Submit" />,
    };
    navigation.setOptions(options);
  }, [navigation, handleSubmit]);

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <Pressable onPress={Keyboard.dismiss} style={{ padding: 14 }}>
        <KanjiInput
          value={initKanjiString}
          onInputChange={handleFieldInput("kanji")}
          readOnly
        />
        <View>
          <Text style={styles.title}>Readings</Text>
          <View
            style={{
              gap: 14,
            }}
          >
            <Card>
              <ReadingInput
                title="KUN"
                initValue={readings.kun}
                onInputChange={handleFieldInput("kun")}
              />
            </Card>

            <Card>
              <ReadingInput
                initValue={readings.on}
                title="ON"
                onInputChange={handleFieldInput("on")}
              />
            </Card>
          </View>
          <DictionaryField
            kanji={initKanjiString}
            dictionary={dictionary}
            onInputChange={handleFieldInput("dictionary")}
          />
          {/* <DecksField decks={decks} onInputChange={handleFieldInput("decks")} /> */}
          <NotesInput onInputChange={handleFieldInput("notes")} value={""} />
        </View>
      </Pressable>
      <Pressable
        onPress={handleSubmit}
        style={[
          styles.submitButtonContainer,
          {
            opacity: !isValid ? 0.5 : 1,
          },
        ]}
        disabled={!isValid}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  submitButtonContainer: {
    backgroundColor: "#eb9234",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 14,
    marginBottom: 14,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: 500,
    fontSize: 20,
  },
  title: {
    color: "whitesmoke",
    textAlign: "center",
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 18,
    marginTop: 24,
  },
});
