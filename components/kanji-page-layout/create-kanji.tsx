import type { FormData } from "@/utils/types";
import { useLayoutEffect, useRef, useState } from "react";
import { KanjiInput, validateKanji } from "../kanji-input";
import { ReadingInput, validateReadings } from "../reading-input";
import { addKanji } from "@/utils/kanji-async-storage";
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

const DEFAULT_FORM_DATA: FormData = {
  kanji: "",
  on: [],
  kun: [],
  notes: "",
  dictionary: [],
};

export function CreateKanji() {
  const navigation = useNavigation();
  const [kanjiString, setKanjiString] = useState<string>("");
  const [isValid, setIsValid] = useState(false);
  const formData = useRef<FormData>(DEFAULT_FORM_DATA);

  const handleSubmit = async () => {
    if (!isValid) return;
    const { kanji: formKanji, on, kun, notes, dictionary } = formData.current;

    const newKanji = {
      id: formKanji,
      kanji: formKanji,
      readings: {
        on,
        kun,
      },
      notes,
      dictionary,
    };
    await addKanji(newKanji);
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
      setKanjiString(value);
      setIsValid(readingsValid && value.length <= 1 && validateKanji(value));
    }
  };

  useLayoutEffect(() => {
    const options = {
      title: "Add kanji",
      headerRight: () => <Button onPress={handleSubmit} title="Submit" />,
    };
    navigation.setOptions(options);
  }, [navigation, handleSubmit]);

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <Pressable onPress={Keyboard.dismiss} style={{ padding: 14 }}>
        <KanjiInput
          value={DEFAULT_FORM_DATA.kanji}
          onInputChange={handleFieldInput("kanji")}
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
                initValue={DEFAULT_FORM_DATA.kun}
                onInputChange={handleFieldInput("kun")}
              />
            </Card>

            <Card>
              <ReadingInput
                initValue={DEFAULT_FORM_DATA.on}
                title="ON"
                onInputChange={handleFieldInput("on")}
              />
            </Card>
          </View>
          <DictionaryField
            kanji={kanjiString}
            dictionary={DEFAULT_FORM_DATA.dictionary}
            onInputChange={handleFieldInput("dictionary")}
          />
          <NotesInput
            onInputChange={handleFieldInput("notes")}
            value={DEFAULT_FORM_DATA.notes}
          />
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
