import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Deck } from "./types";
import { getKanjisIds } from "./kanji-async-storage";

let decks: Deck[];

const ALL_DECK: Deck = {
  id: 'all',
  title: 'All',
  kanjiIds: []
}

export async function initDecks() {
  try {
    const storage = await AsyncStorage.getItem("decks");
    decks = JSON.parse(storage ?? '[]');
    if (decks.length === 0 || !decks.find((deck) => deck.id === 'all')) {
      const allKanjis = await getKanjisIds()
      ALL_DECK.kanjiIds = [...allKanjis]
      decks.unshift(ALL_DECK)
      await AsyncStorage.setItem('decks', JSON.stringify(decks))
    }
  } catch (e) {
    console.error("Could not init decks. ", e);
  }
}

export async function getDecks() {
  if (!decks) throw new Error("Decks are not initialized");
  return decks;
}

export async function addDeck(newDeck:Deck) {
  decks.push(newDeck)
  await AsyncStorage.setItem('decks', JSON.stringify(decks))
}

export function getDeckKanjis(deckId: string) {
  if (!decks) throw new Error("Decks are not initialized");
  return decks.find((deck) => deck.id === deckId)?.kanjiIds
}

