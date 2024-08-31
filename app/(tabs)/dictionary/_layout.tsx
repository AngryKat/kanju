import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Dictionary",
        }}
      />
      <Stack.Screen
        name="[entryId]"
        options={{
          headerTitle: "Edit entry",
        }}
      />
    </Stack>
  );
}
