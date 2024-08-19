import { DictionaryEntry, Kanji } from "@/utils/types";
import { useLayoutEffect, useRef, useState } from "react";
import { KanjiInput, validateKanji } from "../kanji-input";
import { ReadingInput, validateReadings } from "../reading-input";
import { addKanji, getKanjiById } from "@/utils/kanji-async-storage";
import { autoAdd } from "./auto-add-util";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Pressable,
  Keyboard,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { Card } from "../card";
import { DictionaryField } from "./dictionary-field";
import { NotesInput } from "../notes-input";

interface FormData {
  kanji: string;
  on: string[];
  kun: string[];
  notes: string;
  dictionary: DictionaryEntry[];
}

const DEFAULT_FORM_DATA: FormData = {
  kanji: "",
  on: [],
  kun: [],
  notes: "",
  dictionary: [],
};

export function ReadKanji({ kanji }: { kanji: Kanji }) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const options = {
      title: kanji.kanji,
      headerRight: () => (
        <Button
          onPress={() => router.push(`(kanjis)/${kanji.id}/edit`)}
          title="Edit"
        />
      ),
    };
    navigation.setOptions(options);
  });
  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={{ padding: 14 }}
    >
      {kanji && (
        <>
          <KanjiInput
            value={kanji.kanji}
            onInputChange={() => {}}
            readOnly
          />
          <View>
            <Text style={styles.title}>Readings</Text>
            <View
              style={{
                gap: 14,
              }}
            >
              {kanji.readings.kun.length > 0 && (
                <Card>
                  <ReadingInput
                    title="KUN"
                    initValue={kanji.readings.kun}
                    onInputChange={() => {}}
                    readOnly
                  />
                </Card>
              )}
              {kanji.readings.on.length > 0 && (
                <Card>
                  <ReadingInput
                    initValue={kanji.readings.on}
                    title="ON"
                    onInputChange={() => {}}
                    readOnly
                  />
                </Card>
              )}
            </View>
            <DictionaryField
              kanji={kanji.kanji}
              dictionary={kanji.dictionary}
              onInputChange={() => {}}
              readOnly
            />
            <NotesInput onInputChange={() => {}} value={kanji.notes} />
          </View>
        </>
      )}
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
