import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Kanjis",
        }}
      />
      <Stack.Screen name="add-kanji" />
    </Stack>
  );
}
