import {
  useFieldArray,
  useFormContext,
  Controller,
  useWatch,
} from "react-hook-form";
import { Button, FlatList, TextInput, View } from "react-native";
import uuid from "react-native-uuid";

export function DictionaryFieldArray() {
  const { fields, append, remove } = useFieldArray({
    name: "dictionary",
  });

  const kanji = useWatch({ name: "kanji" });

  return (
    <View>
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          render={({ field: { onChange, ...rest } }) => (
            <TextInput
              style={{ color: "whitesmoke" }}
              onChangeText={onChange}
              {...rest}
            />
          )}
          name={`dictionary.${index}.word`}
        />
      ))}
      <Button
        title="Add word"
        onPress={() =>
          append({
            id: uuid.v4(),
            word: kanji,
            meaning: "",
            reading: "",
          })
        }
        disabled={!kanji}
      />
    </View>
  );
}
