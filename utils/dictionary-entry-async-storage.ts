import AsyncStorage from "@react-native-async-storage/async-storage";
import { DictionaryEntry } from "./types";
import { getKanjiById, getKanjis } from "./kanji-async-storage";
import { regex_kanji, regex_kanji_global } from "@/constants/regex";

let dictionaryEntries: Record<string, any>;

export async function initDictionaryEntries() {
  console.log("INIT ENTRIES");

  try {
    const storage = await AsyncStorage.getItem("dictionaryEntries");
    dictionaryEntries = JSON.parse(storage ?? "{}");
    console.log("INIT ENTRIES SUCCESS");
  } catch (e) {
    console.error("Could not init dictionaryEntries. ", e);
  }
}

export function getDictionaryEntries() {
  return Object.values(dictionaryEntries);
}

export function getDictionaryEntryById(id: string) {
  return dictionaryEntries[id];
}

export async function addDictionaryEntry(entry: DictionaryEntry) {
  dictionaryEntries[entry.id] = { ...entry };
  await AsyncStorage.setItem(
    "dictionaryEntries",
    JSON.stringify(dictionaryEntries)
  );
  // function insertIntoDictionary(kanjis: string[], entry: DictionaryEntry) {
  //   if (kanjis.length === 0) {
  //     return;
  //   }

  //   const [currentKanji, ...remainingKanjiArray] = kanjis;

  //   // Ensure current level exists in the dictionary
  //   if (!dictionaryEntries[currentKanji]) {
  //     dictionaryEntries[currentKanji] = {};
  //   }

  //   // If it's the last kanji in the array, set the word
  //   if (remainingKanjiArray.length === 0) {
  //     dictionaryEntries[currentKanji] = entry;
  //   } else {
  //     // Recursively insert into the next level
  //     insertIntoDictionary(
  //       remainingKanjiArray,
  //       entry
  //     );
  //   }
  // }
  // insertIntoDictionary(kanjis, entry);
}

export async function editDictionaryEntry(
  entryId: string,
  newData: Partial<Omit<DictionaryEntry, "id">>
) {
  dictionaryEntries[entryId] = {
    ...dictionaryEntries[entryId],
    ...newData,
  };
  await AsyncStorage.setItem(
    "dictionaryEntries",
    JSON.stringify(dictionaryEntries)
  );
}

export function getDictionaryEntriesWithKanji(kanji: string) {
  if (kanji === "") return [];
  return Object.values(dictionaryEntries).filter((entry) =>
    entry.word.includes(kanji)
  );
}
export async function removeDictionaryEntriesWithKanji(kanji: string) {
  const keysToRemove = Object.keys(dictionaryEntries).filter((key) => {
    const kanjis = dictionaryEntries[key].word
      .match(regex_kanji_global)
      ?.filter((kanji: string) => getKanjiById(kanji));
    if (!kanjis) return;
    return kanjis.length === 0 || (kanjis.length === 1 && kanjis[0] === kanji);
  });
  keysToRemove.forEach((key) => delete dictionaryEntries[key]);
  await AsyncStorage.setItem(
    "dictionaryEntries",
    JSON.stringify(dictionaryEntries)
  );
}

export async function removeDictionaryEntryById(id: string) {
  delete dictionaryEntries[id];
  await AsyncStorage.setItem(
    "dictionaryEntries",
    JSON.stringify(dictionaryEntries)
  );
}

// TEMP.
export async function transformDataForEntries() {
  if (Object.keys(dictionaryEntries).length === 0) return;
  const kanjis = getKanjis();
  const allEntries = Object.values(kanjis).flatMap(
    ({ dictionary }) => dictionary
  );
  dictionaryEntries = allEntries.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.word]: { ...curr },
    }),
    {}
  );
  await AsyncStorage.setItem(
    "dictionaryEntries",
    JSON.stringify(dictionaryEntries)
  );
}
