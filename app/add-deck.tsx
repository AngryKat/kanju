import { router } from "expo-router";
import { useState } from "react";
import { Button, Pressable, SafeAreaView, Text, TextInput } from "react-native";

export default function AddDeckPage() {
  const [title, setTitle] = useState("");
  return (
    <SafeAreaView  style={{ flex: 1 }}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Deck title..."
        style={{
          backgroundColor: "#404040",
          color: "whitesmoke",
          padding: 10,
          borderRadius: 10,
          fontSize: 16,
        }}
      />
      <Button title="Select kanjis" onPress={() => {
        router.push({
          pathname: 'select-deck-kanjis',
          params: {
            title
          }
        })
      }} />
    </SafeAreaView>
  );
}
