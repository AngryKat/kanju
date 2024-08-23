import { Text, Pressable } from "react-native";
import { Card } from "./ui/card";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  onPress: () => void;
}

export function DeckCard({ onPress, title }: Props) {
  return (
    <Card style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ color: "whitesmoke", fontSize: 20 }}>{title}</Text>
      <Pressable
        style={{
          marginLeft: "auto",
          backgroundColor: "#eb9234",
          borderRadius: 50,
          padding: 5,
        }}
        onPress={onPress}
      >
        <Ionicons name="chevron-forward" size={18} color="white" />
      </Pressable>
    </Card>
  );
}
