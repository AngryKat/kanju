import uuid from 'react-native-uuid'
import { Kanji } from "./types";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Deck = Kanji[]

let decks: Record<string, Deck>;

export async function initKanjis() {
  try {
    const storage = await AsyncStorage.getItem("decks");
    decks = JSON.parse(storage ?? "{}");
  } catch (e) {
    console.error("Could not init decks. ", e);
  }
}