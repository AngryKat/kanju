import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function AddCard() {
  return (
    <Pressable onPress={() => { router.navigate('add-kanji')}}>
      <View
        style={{
          padding: 12,
          width: 110,
          height: 110,
          backgroundColor: "#eb9234",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backfaceVisibility: "hidden",
          zIndex: 2,
        }}
      >
        <Text
          style={{
            color: "whitesmoke",
            fontWeight: "500",
            fontSize: 42,
            textAlign: "center",
          }}
        >
          +
        </Text>
      </View>
    </Pressable>
  );
}
