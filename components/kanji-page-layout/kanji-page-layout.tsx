import { Button, SafeAreaView } from "react-native";

import type { Mode, FormData } from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { getKanjiById } from "@/utils/kanji-async-storage";
import { KanjiForm } from "./kanji-form";
import { getKanjiDecks } from "@/utils/kanjis-decks-data-utils";
import { KanjiPageContext } from "./kanji-page-context";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";

export function KanjiPageLayout({ mode }: { mode: Mode }) {
  const navigation = useNavigation();
  const { kanjiId } = useLocalSearchParams();
  const kanjiById = getKanjiById(kanjiId as string);

  if (mode !== "create" && !kanjiById) {
    console.error("Error!");
    return null;
  }

  if (mode === "read" && !kanjiById) {
    console.error("Error!");
    return null;
  }

  const kanjiFormData = kanjiById
    ? ({
        ...kanjiById,
        on: kanjiById?.readings.on.join("、"),
        kun: kanjiById?.readings.kun.join("、"),
        decks: getKanjiDecks(kanjiId as string),
      } as FormData)
    : null;

  return (
    <KanjiPageContext.Provider value={{ mode }}>
      <SafeAreaView>
        <KanjiForm defaultValues={kanjiFormData} />
      </SafeAreaView>
    </KanjiPageContext.Provider>
  );
}
