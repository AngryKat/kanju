import { getDecks } from "./decks-async-storage";

export function getKanjiDecks(kanjiId: string) {
  const decks = getDecks()
  const kanjiDecks = decks.filter((deck) => deck.kanjiIds.includes(kanjiId))
  return kanjiDecks
}