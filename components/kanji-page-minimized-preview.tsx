import {
  View,
  Text,
} from "react-native";

import { ReadingInput } from "@/components/reading-input";
import {
  KanjiInput,
} from "@/components/kanji-input";
import { DictionaryRead } from "./dictionary-read";
import type { DictionaryEntry, Kanji } from "@/utils/types";

interface FormData {
  kanji: string;
  on: string[];
  kun: string[];
  notes: string;
  dictionary: DictionaryEntry[];
}


export function KanjiPageMinimizedPreview({ kanji }: { kanji: Kanji }) {
  const {
    readings: { kun, on },
    dictionary,
  } = kanji;

  return (
    <View
      style={{
        width: 275,
      }}
    >
      <View
        style={{
          transform: [{ scale: 0.85 }],
        }}
      >
        <KanjiInput value={kanji.kanji} onInputChange={() => {}} readOnly />
        <View>
          <View>
            {kun.length !== 0 && (
              <ReadingInput
                title="KUN"
                value={kun}
                onInputChange={() => {}}
                readOnly
              />
            )}
            {on.length !== 0 && (
              <ReadingInput
                value={on}
                title="ON"
                onInputChange={() => {}}
                readOnly
              />
            )}
          </View>
          {dictionary.length !== 0 && (
            <>
              <Text
                style={{
                  color: "whitesmoke",
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 600,
                  marginTop: 24,
                  marginBottom: 12,
                }}
              >
                Dictionary
              </Text>
              <DictionaryRead data={dictionary} kanji={kanji.kanji} />
            </>
          )}
        </View>
      </View>
    </View>
  );
}
