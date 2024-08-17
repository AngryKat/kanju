import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Deck } from "./types";

let decks: Deck[];

export async function initDecks() {
  try {
    const storage = await AsyncStorage.getItem("decks");
    decks = JSON.parse(storage ?? "[]");
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
  const updatedDecks = decks.filter((d) => d.id !== deckId)
  decks = updatedDecks
  await AsyncStorage.setItem('decks', JSON.stringify(decks))
}
