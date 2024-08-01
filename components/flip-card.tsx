import { ReactNode, useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";


export function FlipCard({
  cardFront,
  cardBack,
  onLongPress,
}: {
  cardFront: ReactNode;
  cardBack: ReactNode;
  onLongPress: () => void,
}) {
  const isFlipped = useSharedValue(false);

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration: 500 });

    return {
      transform: [{ rotateY: rotateValue }],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration: 500 });

    return {
      transform: [{ rotateY: rotateValue }],
    };
  });

  return (
    <Pressable
      delayLongPress={500}
      onPress={() => (isFlipped.value = !isFlipped.value)}
      onLongPress={onLongPress}
    >
      <Animated.View
        style={[
          regularCardAnimatedStyle,
          {
            padding: 12,
            width: 110,
            height: 110,
            backgroundColor: "#303030",
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 1,
          },
        ]}
      >
        {cardFront}
        {/* <Text
          style={{
            color: "whitesmoke",
            fontWeight: "500",
            fontSize: 42,
            textAlign: "center",
          }}
        >
          {kanjiCard.front}
        </Text> */}
      </Animated.View>
      <Animated.View
        style={[
          flippedCardAnimatedStyle,
          {
            padding: 12,
            width: 110,
            height: 110,
            backgroundColor: "#303030",
            borderRadius: 32,
            alignItems: "center",
            justifyContent: "center",
            backfaceVisibility: "hidden",
            zIndex: 2,
          },
        ]}
      >
        {cardBack}
        {/* <Text
          style={{
            color: "whitesmoke",
            fontWeight: "500",
            fontSize: 42,
            textAlign: "center",
          }}
        >
          {renderCardBack(kanjiCard.back)}
        </Text> */}
      </Animated.View>
    </Pressable>
  );
}
