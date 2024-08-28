import { getKanjiById } from "@/utils/kanji-async-storage";
import { DictionaryEntry, Kanji } from "@/utils/types";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { Text, View } from "react-native";

export function KanjiLinksList({ entryName }: { entryName: string }) {
  const entry: DictionaryEntry = useWatch({ name: entryName });
  const kanji: string = useWatch({ name: "kanji" });
  const [kanjiLinks, setKanjiLinks] = useState<Kanji[]>([]);
  useEffect(() => {
    const filtered = entry.word
      .split("")
      .filter(
        (char) =>
          char !== kanji &&
          !/^[\u3040-\u309F\u30A0-\u30FF\s,;\u3000\u3001\u3002]+$/.test(char)
      )
      .map((kanji) => {
        return getKanjiById(kanji);
      })
      .filter((k) => !!k);
    setKanjiLinks(filtered);
  }, [entry, kanji]);

  if (kanjiLinks.length === 0) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        paddingLeft: 18,
      }}
    >
      {kanjiLinks.map((k) => (
        <Link
          push
          style={{
            color: "#007FFF",
            paddingHorizontal: 8,
            fontSize: 18,
          }}
          href={`(kanjis)/${k.id}`}
          key={k.id}
        >
          {k.kanji}
        </Link>
      ))}
    </View>
  );
}
