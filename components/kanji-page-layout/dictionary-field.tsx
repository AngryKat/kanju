import { Text } from "react-native";
import { DictionaryInput } from "../dictionary-input";
import { DictionaryEntry } from "@/utils/types";
import { DictionaryRead } from "../dictionary-read";

interface Props {
  kanji: string;
  dictionary: DictionaryEntry[];
  onInputChange: (updatedData: DictionaryEntry[]) => void;
  readOnly: boolean;
}
export function DictionaryField({
  kanji,
  dictionary,
  onInputChange,
  readOnly = false,
}: Props) {
  console.log({ readOnly })
  return (
    <>
      <Text
        style={{
          color: "whitesmoke",
          textAlign: "center",
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 18,
          marginTop: 24,
        }}
      >
        Dictionary
      </Text>

      {readOnly ? (
        <DictionaryRead kanji={kanji} data={dictionary} />
      ) : (
        <DictionaryInput
          kanji={kanji}
          data={dictionary}
          onUpdate={onInputChange}
        />
      )}
    </>
  );
}
