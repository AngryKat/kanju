import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Pressable,
  Keyboard,
} from "react-native";

import { useEffect, useLayoutEffect, useState } from "react";
import { Card } from "@/components/card";
import { ReadingInput } from "@/components/reading-input";
import { NotesInput } from "@/components/notes-input";
import { KanjiInput, validateKanji } from "@/components/kanji-input";
import { addKanji, getKanjiById } from "@/utils/kanji-async-storage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

interface FormData {
  kanji: string;
  on: string[];
  kun: string[];
  notes: string;
}

const DEFAULT_FORM_DATA: FormData = {
  kanji: "",
  on: [],
  kun: [],
  notes: "",
};

type Mode = "read" | "create" | "edit"

const getModeTitle = (mode: Mode, title: string) => {
  if (mode === "read") return title;
  return mode === "create" ? `Add kanji` : `Edit ${title}`;
};

export function KanjiPageLayout({
  mode,
}: {
  mode: Mode;
}) {
  const navigation = useNavigation();
  const { kanjiId } = useLocalSearchParams();
  const [{ kanji, kun, on, notes }, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const disabledButton =  kanji === "" ||
  !validateKanji(kanji) ||
  (kun.length === 0 && on.length === 0);
  const readOnly = mode === "read";
  const handleFieldInput =
    (fieldName: keyof FormData) => (value: string | string[]) => {
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
    };
    await addKanji(newKanji);
    router.navigate("/");
  };

  useEffect(() => {
    if (mode !== "create" && kanjiId) {
      const getKanji = async () => {
        const kanjiById = await getKanjiById(kanjiId as string);
        const { kanji, readings, notes } = kanjiById;
        const form = {
          kanji,
          notes,
          ...readings,
        };
        setFormData(form);
      };
      getKanji();
    }
  }, [mode, kanjiId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: getModeTitle(mode, kanji),
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
              <Card>
                <ReadingInput
                  title="KUN"
                  value={kun}
                  onInputChange={handleFieldInput("kun")}
                  readOnly={readOnly}
                />
              </Card>
              <Card>
                <ReadingInput
                  value={on}
                  title="ON"
                  onInputChange={handleFieldInput("on")}
                  readOnly={readOnly}
                />
              </Card>
            </View>
            {kanji && <View>
              <Text>Dictionary</Text>
              <Text>Add words where this kanji is used</Text>
            </View>}
            <NotesInput
              onInputChange={handleFieldInput("notes")}
              value={notes}
            />
            <View
              style={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
              }}
            >
            </View>
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
