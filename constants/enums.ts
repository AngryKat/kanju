function Enum<T>(baseEnum: T extends object ? T : never) {
  return new Proxy(baseEnum, {
    get(target, name) {
      if (!baseEnum.hasOwnProperty(name)) {
        throw new Error(`"${String(name)}" value does not exist in the enum`);
      }
      return baseEnum[name as keyof typeof baseEnum] as T;
    },
    set(target, name, value) {
      throw new Error("Cannot add a new value to the enum");
    },
  });
}

export const KanjiCardActions = Enum({
  Remove: "remove",
  Edit: "edit",
  View: "view",
} as const);

export const DeckKanjiCardActions = Enum({
  View: "view",
  RemoveFromDeck: "remove-from-deck",
} as const);
