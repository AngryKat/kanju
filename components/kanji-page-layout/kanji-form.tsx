import { FormProvider, useForm } from "react-hook-form";
import { ControlledTextInput } from "../input-fields/controlled-text-input";
import type { FormData, Kanji, Mode } from "@/utils/types";
import {
  Button,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  View,
  Keyboard,
} from "react-native";
import { ControlledKanjiInput } from "../input-fields/controlled-kanji-input";
import { ControlledKanjiReadingInput } from "../input-fields/controlled-kanji-reading-input";
import { addKanji } from "@/utils/kanji-async-storage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { DictionaryFieldArray } from "../input-fields/dictionary-field-array";
import { useKanjiPageContext } from "./kanji-page-context";
import { useLayoutEffect } from "react";

const DEFAULT_FORM_DATA: FormData = {
  kanji: "",
  on: "",
  kun: "",
  notes: "",
  dictionary: [],
  decks: [],
};

const getTitle = (kanji: string, mode: Mode) => {
  if (mode === "create") return "Create kanji";
  return mode === "read" ? kanji : `Edit ${kanji}`;
};

interface Props {
  defaultValues?: FormData | null;
}

export function KanjiForm({ defaultValues }: Props) {
  const { kanjiId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { mode } = useKanjiPageContext();
  const form = useForm({
    mode: "onChange",
    defaultValues: defaultValues ?? DEFAULT_FORM_DATA,
  });

  const handleSubmit = async (data: FormData) => {
    const { kanji, on, kun, notes, dictionary } = data;
    const readings = {
      on: on?.split(/[\s,;\u3000\u3001\u3002]+/),
      kun: kun?.split(/[\s,;\u3000\u3001\u3002]+/),
    };
    const newKanji = {
      id: kanji,
      kanji,
      notes,
      dictionary,
      readings,
    };
    await addKanji(newKanji);
    router.navigate("(kanjis)");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: getTitle((kanjiId as string) || "", mode),
      headerRight: () => (
        <Button
          title={mode === "read" ? "Edit" : "Submit"}
          onPress={
            mode === "read"
              ? () => {
                  router.push(`(kanjis)/${kanjiId as string}/edit`);
                }
              : form.handleSubmit(handleSubmit)
          }
        />
      ),
    });
  }, [navigation, mode, kanjiId]);

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <Pressable onPress={Keyboard.dismiss}>
        <FormProvider {...form}>
          <Text style={styles.title}>Kanji</Text>
          <ControlledKanjiInput />
          <Text style={styles.title}>Readings</Text>
          <ControlledKanjiReadingInput reading="kun" />
          <ControlledKanjiReadingInput reading="on" />
          <Text style={styles.title}>Dictionary</Text>
          <DictionaryFieldArray />
          {mode !== "read" && (
            <Pressable
              onPress={form.handleSubmit(handleSubmit)}
              style={[
                styles.submitButtonContainer,
                {
                  opacity: !form.formState.isValid ? 0.5 : 1,
                },
              ]}
              disabled={!form.formState.isValid}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          )}
        </FormProvider>
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
