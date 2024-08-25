import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Decks",
        }}
      />
      <Stack.Screen
        name="add-deck"
        options={{
          title: "Add deck",
        }}
      />
      <Stack.Screen name="select-deck-kanjis" />
    </Stack>
  );
}
