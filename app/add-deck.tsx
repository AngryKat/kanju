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
  const [inputHighlight, setInputHighlight] = useState(false);
  const [title, setTitle] = useState("");
  console.log(inputHighlight);
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
            setInputHighlight(false);
          }}
          placeholder="Deck title..."
          style={{
            backgroundColor: "#404040",
            color: "whitesmoke",
            padding: 10,
            borderRadius: 10,
            fontSize: 16,
            ...(inputHighlight && { borderWidth: 1, borderColor: "#eb9234" }),
          }}
        />
        {inputHighlight && (
          <Text style={{ fontSize: 10, marginTop: 8, color: "#eb9234" }}>
            Please, enter the deck title
          </Text>
        )}
        <Pressable
          style={{
            opacity: !title ? 0.75 : 1,
            marginLeft: "auto",
            marginTop: inputHighlight ? 14 : 24,
          }}
          onPress={() => {
            if (!title) {
              setInputHighlight(true);
              return;
            }
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
            }}
          >
            Select kanjis →
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
