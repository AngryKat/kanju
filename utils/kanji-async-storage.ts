import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Kanji } from "./types";

const DUMMY_KANJI: Kanji = {
  id: "愚",
  kanji: "愚",
  readings: {
    kun: ['おろ'],
    on: ['グ']
  },
  notes: "",
}

let kanjis: Record<string, Kanji>;

export async function initKanjis() {
  console.log('INIT KANJIS')
  try {
    const storage = await AsyncStorage.getItem("kanjis");
    kanjis = JSON.parse(storage ?? "{}");
    console.log('INIT KANJIS SUCCESS')
    // kanjis[DUMMY_KANJI.id] = DUMMY_KANJI
    // await AsyncStorage.setItem("kanjis", JSON.stringify(kanjis));

  } catch (e) {
    console.error("Could not init kanjis. ", e);
  }
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
