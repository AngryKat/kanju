import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Kanji } from "./types";

let kanjis: Record<string, Kanji>;

export async function initKanjis() {
  try {
    const storage = await AsyncStorage.getItem("kanjis");
    kanjis = JSON.parse(storage ?? "{}");
  } catch (e) {
    console.error("Could not init kanjis. ", e);
  }
}

export function getDictionaryEntries() {
  if (!kanjis) throw new Error("Kanjis are not initialized");
  const arrayUniqueByKey = [
    ...new Map(
      Object.values(kanjis)
        .flatMap(({ dictionary }) => dictionary)
        .map((item) => [item.id, item])
    ).values(),
  ];
  return arrayUniqueByKey.filter((entry) => !!entry.meaning);
}

export function getKanjis() {
  if (!kanjis) throw new Error("Kanjis are not initialized");
  return kanjis;
}
export async function addKanji(kanji: Kanji) {
  if (!kanjis) throw new Error("Kanjis are not initialized");
  kanjis[kanji.id] = { ...kanji };
  await AsyncStorage.setItem("kanjis", JSON.stringify(kanjis));
}
export async function removeKanjiById(kanjiId: string) {
  if (!kanjis) throw new Error("Kanjis are not initialized");
  delete kanjis[kanjiId];
  await AsyncStorage.setItem("kanjis", JSON.stringify(kanjis));
}

export function getKanjiById(kanjiId: string): Kanji | undefined {
  if (!kanjis) throw new Error("Kanjis are not initialized");
  return kanjis[kanjiId];
}

export async function editKanji(
  kanjiId: string,
  newData: Partial<Omit<Kanji, "id" | "kanji">>
) {
  if (!kanjis) throw new Error("Kanjis are not initialized");
  const kanjiToEdit = getKanjiById(kanjiId);
  if (kanjiToEdit === undefined)
    throw new Error(`Kanji with id ${kanjiId} was not found`);
  const newKanji = { ...kanjiToEdit, ...newData };
  kanjis[kanjiId] = { ...newKanji };
  await AsyncStorage.setItem("kanjis", JSON.stringify(kanjis));
}

export function getKanjisIds() {
  if (!kanjis) throw new Error("Kanjis are not initialized");
  return Object.keys(kanjis);
}
