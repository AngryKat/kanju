import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Deck } from "./types";

let decks: Deck[];

export async function initDecks() {
  console.log('INIT DECKS')

  try {
    const storage = await AsyncStorage.getItem("decks");
    decks = JSON.parse(storage ?? "[]");
    console.log('INIT DECKS SUCCESS')

  } catch (e) {
    console.error("Could not init decks. ", e);
  }
}

export function getDecks() {
  if (!decks) throw new Error("Decks are not initialized");
  return decks;
}

export async function addDeck(newDeck: Deck) {
  decks.push(newDeck);
  await AsyncStorage.setItem("decks", JSON.stringify(decks));
}

export function getDeckKanjis(deckId: string) {
  if (!decks) throw new Error("Decks are not initialized");
  return decks.find((deck) => deck.id === deckId)?.kanjiIds;
}

export function getDeck(deckId: string) {
  if (!decks) throw new Error("Decks are not initialized");
  return decks.find((deck) => deck.id === deckId);
}

export async function removeDeck(deckId: string) {
  if (!decks) throw new Error("Decks are not initialized");
  const updatedDecks = decks.filter((d) => d.id !== deckId);
  decks = updatedDecks;
  await AsyncStorage.setItem("decks", JSON.stringify(decks));
}

export async function editDeck(
  deckId: string,
  newData: Partial<Omit<Deck, "id">>
) {
  if (!decks) throw new Error("Decks are not initialized");
  const updatedDeckIndex = decks.findIndex((deck) => deck.id === deckId);
  if (updatedDeckIndex < 0)
    throw new Error(`Could not find deck with id ${deckId}`);
  decks[updatedDeckIndex] = {
    ...decks[updatedDeckIndex],
    ...newData,
  };
  await AsyncStorage.setItem("decks", JSON.stringify(decks));
}
