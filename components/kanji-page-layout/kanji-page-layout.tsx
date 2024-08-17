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

import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { Card } from "@/components/card";
import { ReadingInput } from "@/components/reading-input";
import { NotesInput } from "@/components/notes-input";
import {
  KanjiInput,
  regexKanji,
  validateKanji,
} from "@/components/kanji-input";
import { addKanji, getKanjiById } from "@/utils/kanji-async-storage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import type { DictionaryEntry, Mode } from "@/utils/types";
import { DictionaryField } from "./dictionary-field";
import { autoAdd } from "./auto-add-util";

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

const getModeTitle = (mode: Mode, title: string) => {
  console.log({ mode })
  if (mode === "read") return title;
  return mode === "create" ? `Add kanji` : `Edit ${title}`;
};

export function KanjiPageLayout({ mode }: { mode: Mode }) {
  const navigation = useNavigation();
  const { kanjiId } = useLocalSearchParams();
  const [{ kanji, kun, on, notes, dictionary }, setFormData] =
    useState<FormData>(DEFAULT_FORM_DATA);
  const disabledButton =
    kanji === "" ||
    !validateKanji(kanji) ||
    (kun.length === 0 && on.length === 0);
  const readOnly = mode === "read";
  const handleFieldInput =
    (fieldName: keyof FormData) =>
    (value: string | string[] | DictionaryEntry[]) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    };

  // 3040-309F : hiragana
  // 30A0-30FF : katakana
  // 4E00-9FAF : Common and uncommon kanji
  const handleSubmit = async () => {
    const newKanji = {
      id: kanji,
      kanji,
      readings: {
        on,
        kun,
      },
      notes,
      dictionary,
    };
    await addKanji(newKanji);
    autoAdd(newKanji);
    if (router.canGoBack()) router.back();
    else router.navigate("/");
  };

  useEffect(() => {
    if (mode === "create" || !kanjiId) return;
    const kanjiById = getKanjiById(kanjiId as string);
    const { kanji, readings, notes, dictionary } = kanjiById;
    const form = {
      kanji,
      notes,
      dictionary,
      ...readings,
    };
    setFormData(form as FormData);
  }, [mode, kanjiId]);

  useLayoutEffect(() => {
    const options = {
      title: getModeTitle(mode, kanji),
      headerRight: () =>
        mode === 'read' ? (
          <Button onPress={() => router.push(`/${kanji}/edit`)} title="Edit" />
        ) : (
          <Button
            onPress={() => {
              if (disabledButton) return;
              handleSubmit();
            }}
            title="Submit"
          />
        ),
    };
    navigation.setOptions(options);
  }, [kanji, mode, disabledButton]);

  return (
    <SafeAreaView>
      <ScrollView automaticallyAdjustKeyboardInsets>
        <Pressable onPress={Keyboard.dismiss} style={{ padding: 14 }}>
          <KanjiInput
            value={kanji}
            onInputChange={handleFieldInput("kanji")}
            readOnly={readOnly || mode === "edit"}
          />
          <View>
            <Text style={styles.title}>Readings</Text>
            <View
              style={{
                gap: 14,
              }}
            >
              {((kun.length > 0 && readOnly) || mode !== "read") && (
                <Card>
                  <ReadingInput
                    title="KUN"
                    value={kun}
                    onInputChange={handleFieldInput("kun")}
                    readOnly={readOnly}
                  />
                </Card>
              )}
              {((on.length > 0 && readOnly) || mode !== "read") && (
                <Card>
                  <ReadingInput
                    value={on}
                    title="ON"
                    onInputChange={handleFieldInput("on")}
                    readOnly={readOnly}
                  />
                </Card>
              )}
            </View>
            <DictionaryField
              readOnly={readOnly}
              kanji={kanji}
              dictionary={dictionary}
              onInputChange={handleFieldInput("dictionary")}
            />
            {((notes && readOnly) || mode !== "read") && (
              <NotesInput
                onInputChange={handleFieldInput("notes")}
                value={notes}
                readOnly={readOnly}
              />
            )}
          </View>
        </Pressable>

        {mode !== "read" && (
          <Pressable
            onPress={handleSubmit}
            style={[
              styles.submitButtonContainer,
              {
                opacity: disabledButton ? 0.5 : 1,
              },
            ]}
            disabled={disabledButton}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
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
