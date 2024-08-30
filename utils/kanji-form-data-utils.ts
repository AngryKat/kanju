import { regex_readings_dividers } from "@/constants/regex";
import { addKanji, editKanji, removeKanjiById } from "./kanji-async-storage";
import type { FormData, Kanji } from "./types";
import {
  addDictionaryEntry,
  editDictionaryEntry,
  getDictionaryEntriesWithKanji,
  removeDictionaryEntriesWithKanji,
} from "./dictionary-entry-async-storage";
import { getKanjiDecks } from "./kanjis-decks-data-utils";
import { editDeck } from "./decks-async-storage";

export async function createKanjiWithFormData(data: FormData) {
  const { kanji, on, kun, dictionary, ...rest } = data;
  const readings = {
    on: on !== "" ? on.split(regex_readings_dividers) : [],
    kun: kun !== "" ? kun.split(regex_readings_dividers) : [],
  };

  const newKanji = {
    ...rest,
    id: kanji,
    kanji,
    readings,
  };

  await addKanji(newKanji);
  await Promise.all(dictionary.map((entry) => addDictionaryEntry(entry)));
}

export async function editKanjiWithFormData(kanjiId: string, data: FormData) {
  const { on, kun, dictionary, decks, kanji, ...rest } = data;
  const readings = {
    on: on !== "" ? on.split(regex_readings_dividers) : [],
    kun: kun !== "" ? kun.split(regex_readings_dividers) : [],
  };

  const newKanji = {
    ...rest,
    readings,
  };

  await editKanji(kanjiId, newKanji);
  await Promise.all(
    decks.map((deck) => {
      editDeck(deck.id, deck);
    })
  );
  await Promise.all(
    dictionary.map((entry) => {
      editDictionaryEntry(entry.id, entry);
    })
  );
}

export function getKanjiFormData(kanji: Kanji): FormData {
  return {
    ...kanji,
    on: kanji.readings.on.join("、"),
    kun: kanji.readings.kun.join("、"),
    decks: getKanjiDecks(kanji.id),
    dictionary: getDictionaryEntriesWithKanji(kanji.kanji),
  };
}

export async function deleteKanji(kanjiId: string) {
  await removeKanjiById(kanjiId);
  const kanjiDecks = getKanjiDecks(kanjiId);
  kanjiDecks.forEach(async (deck) => {
    await editDeck(deck.id, {
      kanjiIds: deck.kanjiIds.filter((id) => id !== kanjiId),
    });
  });
  await removeDictionaryEntriesWithKanji(kanjiId);
}
