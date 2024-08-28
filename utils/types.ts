export interface DictionaryEntry {
  id: string;
  word: string;
  reading: string;
  meaning: string;
}

export interface Kanji {
  id: string;
  kanji: string;
  readings: {
    kun: string[];
    on: string[];
  };
  notes: string;
  dictionary: DictionaryEntry[];
}

export interface Setting<T> {
  title: string;
  value: T;
}

export interface Settings {
  autoDictionaryEntryAdd: Setting<boolean | undefined>;
}

export interface Deck {
  id: string;
  title: string;
  kanjiIds: string[];
}
export type Mode = "read" | "create" | "edit";

export interface FormData {
  kanji: string;
  on: string;
  kun: string;
  notes: string;
  dictionary: DictionaryEntry[];
  decks: Deck[];
}

export interface Readings {
  kun: string[];
  on: string[];
}