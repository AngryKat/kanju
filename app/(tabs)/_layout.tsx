import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#eb9234" }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(kanjis)"
        options={{
          headerShown: false,
          title: "Kanjis",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>漢字</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="(decks)"
        options={{
          headerShown: false,
          title: "Decks",
          tabBarIcon: ({ color }) => (
            <Ionicons color={color} size={20} name="albums" />
          ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          headerShown: false,
          title: "Dictionary",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
