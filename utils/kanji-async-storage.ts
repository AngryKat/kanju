import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Kanji {
  id: string;
  kanji: string;
  readings: {
    kun: string[];
    on: string[];
  };
  notes: string;
}

let kanjis: Record<string, Kanji>;

export async function initKanjis() {
  try {
    const storage = await AsyncStorage.getItem("kanjis");
    kanjis = JSON.parse(storage ?? "{}");
  } catch (e) {
    console.error("Could not init kanjis. ", e);
  }
}

export async function getKanjis() {
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

export async function getKanjiById(kanjiId: string) {
  if (!kanjis) throw new Error("Kanjis are not initialized");
  return kanjis[kanjiId];
}

export async function editKanji(
  kanjiId: string,
  newData: Omit<Kanji, "id" | "kanji">
) {
  if (!kanjis) throw new Error("Kanjis are not initialized");
  const kanjiEdited = await getKanjiById(kanjiId);
  const newKanji = { ...kanjiEdited, ...newData };
  kanjis[kanjiId] = { ...newKanji } 
}

// export async function addKanji(kanji: Kanji) {
//   try {
//     const kanjis = await getKanjis();
//     (kanjis as Record<string, Kanji>)[kanji.id] = { ...kanji };
//     await AsyncStorage.setItem("kanjis", JSON.stringify(kanjis));
//   } catch (e) {
//     console.error("Could not add kanji ", e);
//   }
// }

// export async function removeKanji(kanjiId: string) {
//   try {
//     const kanjis = await getKanjis();
//     if (!(kanjiId in kanjis)) {
//       throw new Error("Kanji is not in the storage");
//     }
//     delete (kanjis as Record<string, Kanji>)[kanjiId];
//     await AsyncStorage.setItem("kanjis", JSON.stringify(kanjis));
//   } catch (e) {
//     console.error("Could not remove kanji.", e);
//   }
// }

// export async function getKanjis(): Promise<Record<string, Kanji>> {
//   try {
//     const kanjis = await AsyncStorage.getItem("kanjis");
//     const parsed = JSON.parse(kanjis || "{}");
//     return parsed;
//   } catch (e) {
//     console.error("Could not get kanjis ", e);
//     return {};
//   }
// }

// export async function editKanji(kanjiId: string, newData: Omit<Kanji, 'id' | 'kanji'>) {
//   try {
//     const kanjis = await getKanjis()
//     const kanji = await getKanji(kanjiId);
//     if ()
//     kanjis[kanjiId] =  { ...kanji, ...newData }
//     await AsyncStorage.setItem('kanjis', JSON.stringify(kanjis))
//   } catch (e) {
//     console.error("Could not get kanji ", kanjiId, e);
//   }
// }

// export async function getKanji(kanjiId: string): Promise<{} | Kanji> {
//   try {
//     const kanjis = await getKanjis()
//     return kanjis[kanjiId];
//   } catch (e) {
//     console.error("Could not get kanji ", kanjiId, e);
//     return {};
//   }
// }

// class KanjiAsyncStorage {
//   #initialized: boolean
//   #kanjis: Record<string, Kanji>

//   private constructor(kanjis: Record<string, Kanji>) {
//     this.#kanjis = kanjis;
//     this.#initialized = true;
// }

//   static async getInstance() {
//     try {
//       const kanjis = await AsyncStorage.getItem('kanjis')
//       const kanjisParsed = JSON.parse(kanjis ?? '{}')
//       return new KanjiAsyncStorage(kanjisParsed);
//     } catch (e) {
//       console.error('Could not create class instance ', e)
//     }
// }

//   get kanjis(): Record<string, Kanji> {
//     return this.#kanjis
//   }

// }
