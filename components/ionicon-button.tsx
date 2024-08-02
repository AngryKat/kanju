import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, type ViewStyle } from "react-native";

interface Props {
  name: ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  iconSize?: number;
  color?: string;
  style?: ViewStyle;
}

export function IonIconButton({
  name,
  onPress,
  style,
  iconSize = 15,
  color = "whitesmoke",
}: Props) {
  return (
    <Pressable onPress={onPress} style={style}>
      <Ionicons name={name} size={iconSize} color={color} />
    </Pressable>
  );
}
