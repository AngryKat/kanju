import { Card } from "@/components/ui/card";
import {
  editDictionaryEntry,
  getDictionaryEntryById,
} from "@/utils/dictionary-entry-async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";

export default function EditDictionaryEntry() {
  const { entryId } = useLocalSearchParams();
  const form = useForm({
    defaultValues: getDictionaryEntryById(entryId as string),
  });

  const handleEdit = async (data: any) => {
    await editDictionaryEntry(entryId as string, data);
    router.navigate("dictionary");
  };
  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          alignSelf: "baseline",
          marginHorizontal: "auto",
          marginTop: 28,
          marginBottom: 20,
        }}
      >
        <Controller
          control={form.control}
          name="word"
          render={({ field: { onChange, ...fieldProps } }) => (
            <TextInput
              {...fieldProps}
              readOnly
              style={{
                color: "whitesmoke",
                fontSize: 32,
              }}
            />
          )}
        />
      </View>
      <Card
        style={{
          marginHorizontal: 14,
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            color: "whitesmoke",
            fontSize: 18,
          }}
        >
          Reading:
        </Text>
        <Controller
          control={form.control}
          name="reading"
          render={({ field: { onChange, ...fieldProps } }) => (
            <TextInput
              {...fieldProps}
              onChangeText={onChange}
              style={{
                flex: 1,
                color: "whitesmoke",
                paddingBottom: 8,
                paddingLeft: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#404040",
                fontSize: 18,
              }}
            />
          )}
        />
      </Card>

      <Card
        style={{
          flexDirection: "row",
          marginHorizontal: 14,
        }}
      >
        <Text
          style={{
            color: "whitesmoke",
            fontSize: 18,
          }}
        >
          Meaning:
        </Text>
        <Controller
          control={form.control}
          name="meaning"
          render={({ field: { onChange, ...fieldProps } }) => (
            <TextInput
              {...fieldProps}
              onChangeText={onChange}
              style={{
                flex: 1,
                color: "whitesmoke",
                paddingBottom: 8,
                paddingLeft: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#404040",
                fontSize: 18,
              }}
            />
          )}
        />
      </Card>
      <Button title="Submit" onPress={form.handleSubmit(handleEdit)} />
    </View>
  );
}
