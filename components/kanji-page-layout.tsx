import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Pressable,
  Keyboard,
  Button,
} from "react-native";

import { useEffect, useLayoutEffect, useState } from "react";
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
import { DictionaryInput } from "./dictionary-input";
import { DictionaryRead } from "./dictionary-read";
import type { DictionaryEntry } from "@/utils/types";

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

type Mode = "read" | "create" | "edit";

const getModeTitle = (mode: Mode, title: string) => {
  if (mode === "read") return title;
  return mode === "create" ? `Add kanji` : `Edit ${title}`;
};

export function KanjiPageLayout({ mode }: { mode: Mode }) {
  const navigation = useNavigation();
  const { kanjiId } = useLocalSearchParams();
  const [{ kanji, kun, on, notes, dictionary }, setFormData] =
    useState<FormData>(DEFAULT_FORM_DATA);
  const showDictionaryField =
    mode !== "read" &&
    (regexKanji.test(kanji) || (regexKanji.test(kanji) && kanji.length === 1));
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
    router.navigate("/");
  };

  useEffect(() => {
    if (mode !== "create" && kanjiId) {
      const getKanji = async () => {
        const kanjiById = await getKanjiById(kanjiId as string);
        const { kanji, readings, notes, dictionary } = kanjiById;
        const form = {
          kanji,
          notes,
          dictionary,
          ...readings,
        };
        setFormData(form as FormData);
      };
      getKanji();
    }
  }, [mode, kanjiId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: getModeTitle(mode, kanji),
      ...(mode === "read" && {
        headerRight: () => (
          <Button
            onPress={() => router.replace(`/${kanji}/edit`)}
            title="Edit"
          />
        ),
      }),
    });
  }, [kanji, mode]);

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
            <Text
              style={{
                color: "whitesmoke",
                textAlign: "center",
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 18,
                marginTop: 24,
              }}
            >
              Readings
            </Text>
            <View
              style={{
                gap: 14,
              }}
            >
              {((kun.length > 0 && mode === "read") || mode !== "read") && (
                <Card>
                  <ReadingInput
                    title="KUN"
                    value={kun}
                    onInputChange={handleFieldInput("kun")}
                    readOnly={readOnly}
                  />
                </Card>
              )}
              {((on.length > 0 && mode === "read") || mode !== "read") && (
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
            {showDictionaryField && (
              <>
                <Text
                  style={{
                    color: "whitesmoke",
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 600,
                    marginTop: 24,
                  }}
                >
                  Dictionary
                </Text>
                <Text
                  style={{
                    color: "#404040",
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: 500,
                    marginBottom: 18,
                  }}
                >
                  Add words where this kanji is used
                </Text>
                <DictionaryInput
                  kanji={kanji}
                  data={dictionary}
                  onUpdate={handleFieldInput("dictionary")}
                />
              </>
            )}
            {mode === "read" && (
              <>
                <Text
                  style={{
                    color: "whitesmoke",
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 600,
                    marginTop: 24,
                    marginBottom: 12,
                  }}
                >
                  Dictionary
                </Text>
                <DictionaryRead data={dictionary} kanji={kanji} />
              </>
            )}
            {((notes && mode === "read") || mode !== "read") && (
              <NotesInput
                onInputChange={handleFieldInput("notes")}
                value={notes}
                readOnly={readOnly}
              />
            )}
            <View
              style={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
              }}
            ></View>
          </View>
        </Pressable>

        {mode !== "read" && (
          <Pressable
            onPress={handleSubmit}
            style={{
              opacity: disabledButton ? 0.5 : 1,
              backgroundColor: "#eb9234",
              padding: 14,
              borderRadius: 12,
              marginTop: 40,
              marginHorizontal: 14,
            }}
            disabled={disabledButton}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: 500,
                fontSize: 20,
              }}
            >
              Submit
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
