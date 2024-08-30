import { editDeck, getDeck, getDecks } from "./decks-async-storage";

export function getKanjiDecks(kanjiId: string) {
  const decks = getDecks();
  const kanjiDecks = decks.filter((deck) => deck.kanjiIds.includes(kanjiId));
  return kanjiDecks;
}

export async function deleteKanjiFromDeck(kanjiId: string, deckId: string) {
  const deck = getDeck(deckId);
  if (!deck) {
    console.error("Could not find deck with id ", deckId);
    return;
  }
  const updatedKanjis = deck.kanjiIds.filter((id) => id !== kanjiId);
  await editDeck(deckId, { kanjiIds: [...updatedKanjis] });
}
