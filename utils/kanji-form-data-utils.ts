import { regex_readings_dividers } from "@/constants/regex";
import { addKanji, editKanji, removeKanjiById } from "./kanji-async-storage";
import type { FormData, Kanji } from "./types";
import {
  addDictionaryEntry,
  editDictionaryEntry,
  getDictionaryEntriesWithKanji,
  removeDictionaryEntriesWithKanji,
  removeDictionaryEntryById,
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
  const previousEntries = getDictionaryEntriesWithKanji(kanjiId); // .map(({ id }) => id);
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
  const diff = previousEntries.filter(
    ({ id }) => !dictionary.map(({ id }) => id).includes(id)
  );

  await Promise.all(dictionary.map((entry) => addDictionaryEntry(entry)));
  if (diff.length > 0) {
    await Promise.all(diff.map((entry) => removeDictionaryEntryById(entry.id)));
  }
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
