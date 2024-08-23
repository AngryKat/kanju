import { FormProvider, useForm } from "react-hook-form";
import { ControlledTextInput } from "./controlled-text-input";
import type { FormData } from "@/utils/types";
import {
  Button,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  View,
  Keyboard,
} from "react-native";
import { ControlledKanjiInput } from "./controlled-kanji-input";
import { ControlledKanjiReadingInput } from "./controlled-kanji-reading-input";
import { addKanji } from "@/utils/kanji-async-storage";
import { router } from "expo-router";
import { DictionaryFieldArray } from "./dictionary-field-array";

const DEFAULT_FORM_DATA: FormData = {
  kanji: "",
  on: "",
  kun: "",
  notes: "",
  dictionary: [],
  decks: [],
};

export function KanjiForm() {
  const form = useForm({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_DATA,
  });
  console.log({
    f: form.formState.errors,
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
  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <Pressable
        onPress={Keyboard.dismiss}
        style={{
          paddingTop: 24,
        }}
      >
        <FormProvider {...form}>
          <ControlledKanjiInput />
          <ControlledKanjiReadingInput reading="kun" />
          <ControlledKanjiReadingInput reading="on" />
          <DictionaryFieldArray />
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
