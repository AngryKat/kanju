import { SafeAreaView } from "react-native";

import { Kanji, type Mode } from "@/utils/types";
import { ReadKanji } from "./read-kanji";
import { CreateKanji } from "./create-kanji";
import { useLocalSearchParams } from "expo-router";
import { getKanjiById } from "@/utils/kanji-async-storage";
import { EditKanji } from "./edit-kanji";
import { KanjiForm } from "../kanji-form";

const formsByMode: Record<
  Mode,
  (props: { kanji: Kanji }) => React.JSX.Element
> = {
  read: (props: any) => ReadKanji(props),
  edit: (props: any) => EditKanji(props),
  create: KanjiForm,
  // create: CreateKanji,
};

export function KanjiPageLayout({ mode }: { mode: Mode }) {
  const { kanjiId } = useLocalSearchParams();
  const kanjiById = getKanjiById(kanjiId as string);
  const Form = formsByMode[mode];

  if (mode !== "create" && !kanjiById) {
    console.error("Error!");
    return null;
  }

  return (
    <SafeAreaView>
      {mode === "create" ? <KanjiForm /> : <Form kanji={kanjiById!} />}
    </SafeAreaView>
  );
}
