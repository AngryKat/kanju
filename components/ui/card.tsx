import { ReactNode } from "react";
import { View, type ViewStyle, type StyleProp } from "react-native";

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: "#303030",
          padding: 16,
          borderRadius: 15,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
