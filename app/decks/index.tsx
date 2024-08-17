import { Card } from "@/components/card";
import { DeckKanjiCard } from "@/components/deck-kanji-card";
import {
  getDeckKanjis,
  getDecks,
  removeDeck,
} from "@/utils/decks-async-storage";
import { getKanjiById } from "@/utils/kanji-async-storage";
import { Deck, Kanji } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  Pressable,
  Text,
  View,
  Animated,
  LayoutAnimation,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
// import Animated, {
//   Easing,
//   interpolate,
//   ReduceMotion,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";

const renderAddNewDeckCard = () => {
  return (
    <Pressable
      onPress={() => router.navigate("add-deck")}
      style={{
        marginLeft: 14,
        marginTop: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Text style={{ color: "#eb9234", fontSize: 18, paddingLeft: 8 }}>
        New deck
      </Text>
      <Ionicons name="add" size={20} color="#eb9234" />
    </Pressable>
  );
};

const renderRightActions =
  (id: string, onRemove: (id: string) => void, onEdit: (id: string) => void) =>
  (progress: any, dragX: any) => {
    const opacityRightButton = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    const opacityLeftButton = dragX.interpolate({
      inputRange: [-135, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={{ flexDirection: "row" }}>
        <Animated.View
          style={[
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
              marginRight: 8,
              marginLeft: -4,
              opacity: opacityLeftButton,
            },
          ]}
        >
          <Pressable
            onPress={() => onEdit(id)}
            style={{
              backgroundColor: "#eb9234",
              padding: 14,
              borderRadius: 15,
            }}
          >
            <Ionicons name="pencil" size={28} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View
          style={[
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
              marginRight: 14,
              opacity: opacityRightButton,
            },
          ]}
        >
          <Pressable
            onPress={() => onRemove(id)}
            style={{
              backgroundColor: "red",
              padding: 14,
              borderRadius: 15,
            }}
          >
            <Ionicons name="trash-outline" size={28} color="white" />
          </Pressable>
        </Animated.View>
      </View>
    );
  };

// const RotatingChevronIcon = ({ rotated }: { rotated: boolean }) => {
//   const spinStyle = useAnimatedStyle(() => {
//     const spinValue = interpolate(Number(rotated), [0, 1], [0, 90]);
//     const timedSpin = withTiming(`${spinValue}deg`);
//     return {
//       transform: [{ rotate: timedSpin }],
//     };
//   });

//   return (
//     <Animated.View style={[spinStyle, { marginLeft: "auto" }]}>
//       <Ionicons
//         name="chevron-forward"
//         style={{ marginLeft: "auto" }}
//         size={18}
//         color="#909090"
//       />
//     </Animated.View>
//   );
// };

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);

  const getDecksFromStorage = () => {
    const storageDecks = getDecks();
    setDecks(storageDecks);
  };

  useFocusEffect(
    useCallback(() => {
      getDecksFromStorage();
    }, [])
  );

  const clickDeckHandler = (id: string) => {
    router.push(`decks/${id}`);
  };

  const removeDeckHandler = async (id: string) => {
    await removeDeck(id);
    getDecksFromStorage();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={{
            paddingTop: 20,
          }}
        >
          {decks.map((deck) => (
            <Swipeable
              key={deck.id}
              renderRightActions={renderRightActions(
                deck.id,
                removeDeckHandler,
                removeDeckHandler
              )}
            >
              <Animated.View
                style={{
                  marginBottom: 10,
                  marginHorizontal: 14,
                }}
              >
                <Card style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "whitesmoke" }}>{deck.title}</Text>
                  <Pressable
                    style={{
                      marginLeft: "auto",
                      backgroundColor: "#eb9234",
                      borderRadius: 50,
                      padding: 5,
                    }}
                    onPress={() => clickDeckHandler(deck.id)}
                  >
                    <Ionicons name="chevron-forward" size={18} color="white" />
                  </Pressable>
                </Card>
              </Animated.View>
            </Swipeable>
          ))}
          {renderAddNewDeckCard()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
