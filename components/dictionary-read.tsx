import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, TextInput, Text } from "react-native";
import { Card } from "./card";
import { DictionaryEntry, Kanji } from "@/utils/types";
import { DictionaryEntryRead } from "./dictionary-entry-read";
import { regexKanji } from "./kanji-input";
import { Link } from "expo-router";
import { getKanjiById } from "@/utils/kanji-async-storage";

interface DictionaryReadProps {
  kanji: string;
  data: DictionaryEntry[];
}

export const DictionaryRead: React.FC<DictionaryReadProps> = ({
  data,
  kanji,
}) => {
  const [kanjiLinks, setKanjiLinks] = useState<Kanji[] | []>([]);
  const withMeaning = useMemo(() => {
    return data.filter((entry) => entry.meaning.length > 0);
  }, [data]);

  useEffect(() => {
    const filterKanjis = async () => {
      const filtered = (
        await Promise.all(
          [...new Set(data.flatMap((entry) => entry.word.split("")))]
            .filter(
              (char) =>
                char !== kanji &&
                !/^[\u3040-\u309F\u30A0-\u30FF\s,;\u3000\u3001\u3002]+$/.test(
                  char
                )
            )
            .map((kanji) => {
              return getKanjiById(kanji);
            })
        )
      ).filter((k) => !!k);
      setKanjiLinks(filtered);
    };
    filterKanjis();
  }, [data]);

  return (
    <ScrollView>
      {withMeaning.length !== 0 &&
        withMeaning.map((entry) => (
          <DictionaryEntryRead entry={entry} key={entry.id} />
        ))}
      {kanjiLinks.length !== 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            paddingLeft: 8,
          }}
        >
          <Text style={{ color: "whitesmoke" }}>Kanjis mentioned: </Text>
          {kanjiLinks.map((k) => (
            <Link
              push
              style={{
                color: "#007FFF",
                paddingHorizontal: 8,
                fontSize: 18,
              }}
              href={`/${k.id}`}
              key={k.id}
            >
              {k.kanji}
            </Link>
          ))}
        </View>
      )}
    </ScrollView>
  );
};
