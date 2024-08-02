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
  dictionary: DictionaryEntry[]
}