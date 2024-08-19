import { Text } from "react-native";
import { DictionaryInput } from "../dictionary-input";
import { DictionaryEntry } from "@/utils/types";
import { DictionaryRead } from "../dictionary-read";

interface Props {
  kanji: string;
  dictionary: DictionaryEntry[];
  onInputChange: (updatedData: DictionaryEntry[]) => void;
  readOnly?: boolean;
}
export function DictionaryField({
  kanji,
  dictionary,
  onInputChange,
  readOnly = false,
}: Props) {
  const dictionaryWithMeanings = dictionary.filter(
    (dict) => dict.meaning !== ""
  );

  if (!readOnly) {
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
        <DictionaryInput
          kanji={kanji}
          data={dictionary}
          onUpdate={onInputChange}
        />
      </>
    );
  }
  return (
    <>
      {dictionaryWithMeanings.length > 0 && (
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
          <DictionaryRead kanji={kanji} data={dictionaryWithMeanings} />
        </>
      )}
    </>
  );
}
