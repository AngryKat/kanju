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

import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Card } from "@/components/card";
import { ReadingInput, validateReadings } from "@/components/reading-input";
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
  if (mode === "read") return title;
  return mode === "create" ? `Add kanji` : `Edit ${title}`;
};

export function KanjiPageLayout({ mode }: { mode: Mode }) {
  const [isValid, setIsValid] = useState(false);
  const navigation = useNavigation();
  const { kanjiId } = useLocalSearchParams();
  const formData = useRef<FormData>(DEFAULT_FORM_DATA);
  const kanjiById = getKanjiById(kanjiId as string);

  useEffect(() => {
    formData.current =
      mode === "create"
        ? { ...DEFAULT_FORM_DATA }
        : {
            kanji: kanjiById.kanji,
            notes: kanjiById.notes,
            dictionary: kanjiById.dictionary,
            ...kanjiById.readings,
          };
  }, [mode, kanjiById]);

  const readOnly = mode === "read";
  const handleFieldInput = (fieldName: keyof FormData) => (value: any) => {
    formData.current = {
      ...formData.current,
      [fieldName]: value,
    };

    const readings = formData.current.kun.concat(formData.current.on).join(" ");

    setIsValid(
      validateKanji(formData.current.kanji) &&
        readings.length !== 0 &&
        validateReadings(readings)
    );
  };

  // 3040-309F : hiragana
  // 30A0-30FF : katakana
  // 4E00-9FAF : Common and uncommon kanji
  const handleSubmit = async () => {
    if (!isValid) return;
    const { kanji, on, kun, notes, dictionary } = formData.current;

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
    router.navigate("(kanjis)");
  };

  useLayoutEffect(() => {
    const options = {
      title: getModeTitle(mode, formData.current.kanji),
      headerRight: () =>
        mode === "read" ? (
          <Button
            onPress={() => router.push(`/${formData.current.kanji}/edit`)}
            title="Edit"
          />
        ) : (
          <Button
            onPress={() => {
              handleSubmit();
            }}
            title="Submit"
          />
        ),
    };
    navigation.setOptions(options);
  });

  return (
    <SafeAreaView>
      <ScrollView automaticallyAdjustKeyboardInsets>
        <Pressable onPress={Keyboard.dismiss} style={{ padding: 14 }}>
          <Text style={{ color: "white" }}>
            {isValid ? "I am valid!" : "I am not valid(("}
          </Text>
          <KanjiInput
            initValue={formData.current.kanji}
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
              {((readOnly && formData.current.kun.length > 0) ||
                mode !== "read") && (
                <Card>
                  <ReadingInput
                    title="KUN"
                    initValue={formData.current.kun}
                    onInputChange={handleFieldInput("kun")}
                    readOnly={readOnly}
                  />
                </Card>
              )}
              {((readOnly && formData.current.on.length > 0) ||
                mode !== "read") && (
                <Card>
                  <ReadingInput
                    initValue={formData.current.on}
                    title="ON"
                    onInputChange={handleFieldInput("on")}
                    readOnly={readOnly}
                  />
                </Card>
              )}
            </View>
            <DictionaryField
              readOnly={readOnly}
              kanji={formData.current.kanji}
              dictionary={formData.current.dictionary}
              onInputChange={handleFieldInput("dictionary")}
            />
            {((formData.current.notes && readOnly) || mode !== "read") && (
              <NotesInput
                onInputChange={handleFieldInput("notes")}
                value={formData.current.notes}
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
                opacity: !isValid ? 0.5 : 1,
              },
            ]}
            disabled={!isValid}
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
