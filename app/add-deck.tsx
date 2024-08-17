import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddDeckPage() {
  const [title, setTitle] = useState("");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          padding: 14,
          marginTop: -200,
        }}
      >
        <TextInput
          value={title}
          onChangeText={(value) => {
            setTitle(value);
          }}
          placeholder="Deck title..."
          style={{
            borderBottomColor: "#eb9234",
            borderBottomWidth: 1,
            color: "whitesmoke",
            padding: 10,
            borderRadius: 10,
            fontSize: 28,
          }}
        />
        <Pressable
          style={{
            opacity: !title ? 0.25 : 1,
            marginLeft: "auto",
            marginTop: 24,
          }}
          onPress={() => {
            if (!title) return;
            router.push({
              pathname: "select-deck-kanjis",
              params: {
                title,
              },
            });
          }}
        >
          <Text
            style={{
              color: "#eb9234",
              fontSize: 18,
            }}
          >
            Select kanjis →
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
