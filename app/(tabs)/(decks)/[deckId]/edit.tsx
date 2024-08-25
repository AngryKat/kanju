import { getDeck } from "@/utils/decks-async-storage";
import { Deck } from "@/utils/types";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";

export default function EditDeckPage() {
  const navigation = useNavigation();
  const { deckId } = useLocalSearchParams();
  const [title, setTitle] = useState("");

  useEffect(() => {
    const deck = getDeck(deckId as string);
    if (!deck) return;
    setTitle(deck.title);
  }, [deckId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Edit deck ${title}`,
      headerBackTitle: "Back",
    });
  }, [navigation, title]);
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
                deckId,
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
