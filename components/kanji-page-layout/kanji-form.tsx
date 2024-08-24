import { FormProvider, useForm } from "react-hook-form";
import type { Deck, FormData, Mode } from "@/utils/types";
import {
  Button,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
  View,
} from "react-native";
import { ControlledKanjiInput } from "../input-fields/controlled-kanji-input";
import { ControlledKanjiReadingInput } from "../input-fields/controlled-kanji-reading-input";
import { addKanji } from "@/utils/kanji-async-storage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { DictionaryFieldArray } from "../input-fields/dictionary-field-array";
import { useKanjiPageContext } from "./kanji-page-context";
import { useLayoutEffect } from "react";
import { deleteKanji } from "@/utils/kanjis-decks-data-utils";
import { readings_dividers_regex } from "@/constants/regex";
import { DecksInput } from "../decks-input";
import { addKanjiToDeck, editDeck } from "@/utils/decks-async-storage";

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
    const { kanji, on, kun, decks, ...rest } = data;
    const readings = {
      on: on !== "" ? on?.split(readings_dividers_regex) : [],
      kun: kun !== "" ? kun?.split(readings_dividers_regex) : [],
    };

    const newKanji = {
      id: kanji,
      kanji,
      readings,
      ...rest,
    };
    await addKanji(newKanji);
    decks.forEach(async (deck) => {
      try {
        await addKanjiToDeck(deck.id, kanji);
      } catch (e) {
        console.error(`Could not save kanji to the deck ${deck.title}`);
        // form.setError("decks", {
        //   message: `Could not save kanji to the deck ${deck.title}`,
        // });
      }
    });
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
          <View
            style={{
              marginBottom: 18,
            }}
          >
            <Text style={styles.title}>Kanji</Text>
            <ControlledKanjiInput />
            <Text style={styles.title}>Readings</Text>
            <ControlledKanjiReadingInput reading="kun" />
            <ControlledKanjiReadingInput reading="on" />
            <Text style={styles.title}>Dictionary</Text>
            <DictionaryFieldArray />
            <Text style={styles.title}>Decks</Text>
            <DecksInput />
          </View>
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

          {mode === "edit" && (
            <Button
              color="red"
              title="Delete"
              onPress={async () => {
                await deleteKanji(kanjiId as string);
                router.navigate("(kanjis)");
              }}
            />
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
