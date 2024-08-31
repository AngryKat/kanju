import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import uuid from "react-native-uuid";
import { ControlledDictionaryInput } from "./controlled-dictionary-input";
import { Ionicons } from "@expo/vector-icons";
import { useKanjiPageContext } from "../kanji-page-layout/kanji-page-context";
import { getDictionaryEntriesWithKanji } from "@/utils/dictionary-entry-async-storage";
import { DictionaryEntryRead } from "../dictionary-entry-read";

export function DictionaryFieldArray() {
  const { fields, append, remove } = useFieldArray({
    name: "dictionary",
  });

  const kanji = useWatch({ name: "kanji" });
  const { getFieldState } = useFormContext();
  const disabled = !kanji || getFieldState("kanji").invalid;
  const { mode } = useKanjiPageContext();
  const readOnly = mode === "read";

  const handleWordAdd = () => {
    if (disabled) return;
    append({
      id: uuid.v4(),
      word: kanji,
      meaning: "",
      reading: "",
    });
  };

  return (
    <View
      style={{
        gap: 6,
      }}
    >
      {mode === "create" &&
        getDictionaryEntriesWithKanji(kanji).length !== 0 && (
          <View>
            <Text
              style={{
                color: "#c0c0c0",
                fontSize: 16,
                marginLeft: 16,
                marginBottom: 8,
              }}
            >
              Already in the dictionary
            </Text>
            {getDictionaryEntriesWithKanji(kanji).map((entry) => (
              <DictionaryEntryRead key={entry.id} entry={entry} kanji={kanji} />
            ))}
          </View>
        )}
      {fields.map((field, index) => {
        return (
          <ControlledDictionaryInput
            key={field.id}
            name={`dictionary.${index}`}
            onRemove={() => remove(index)}
            readOnly={readOnly}
          />
        );
      })}
      {!readOnly && (
        <Pressable
          onPress={handleWordAdd}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={disabled ? "#505050" : "#eb9234"}
          />
          <Text
            style={{
              fontSize: 18,
              color: disabled ? "#505050" : "#eb9234",
            }}
          >
            Add a new word
          </Text>
        </Pressable>
      )}
    </View>
  );
}
