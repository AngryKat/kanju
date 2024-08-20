import { DeckCard } from "@/components/deck-card";
import {
  getDecks,
  removeDeck,
} from "@/utils/decks-async-storage";
import { Deck } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useNavigation } from "expo-router";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ScrollView,
  SafeAreaView,
  Pressable,
  Text,
  View,
  Animated,
  LayoutAnimation,
  Button,
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
  (
    id: string,
    {
      onRemove,
      onEdit,
    }: { onRemove: (id: string) => void; onEdit: (id: string) => void }
  ) =>
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

let currOpenedDeckId: string;
let prevOpenedDeckId: string;

export default function DecksPage() {
  const navigation = useNavigation();
  const swipeable = useRef<any>({});
  const [decks, setDecks] = useState<Deck[]>([]);

  const getDecksFromStorage = () => {
    const storageDecks = getDecks();
    console.log('LENGTH', storageDecks)
    setDecks(storageDecks);
  };

  const closeOpenedCard = () => {
    swipeable.current?.[currOpenedDeckId]?.close();
  };

  useFocusEffect(
    useCallback(() => {
      getDecksFromStorage();
    }, [getDecksFromStorage])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="+1"
          onPress={() => {
            router.push("add-deck");
            closeOpenedCard();
          }}
        />
      ),
    });
  }, [router, navigation]);

  const clickDeckHandler = (id: string) => {
    router.push(`(decks)/${id}`);
  };

  const removeDeckHandler = async (id: string) => {
    await removeDeck(id);
    getDecksFromStorage();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  const editDeckHandler = async (id: string) => {
    router.push(`/${id}/edit`);
    closeOpenedCard();
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
              onSwipeableWillOpen={() => {
                if (prevOpenedDeckId !== deck.id) {
                  swipeable.current?.[prevOpenedDeckId]?.close();
                }
                prevOpenedDeckId = deck.id;
                currOpenedDeckId = deck.id;
              }}
              ref={(ref) => (swipeable.current[deck.id] = ref)}
              key={deck.id}
              renderRightActions={renderRightActions(deck.id, {
                onRemove: removeDeckHandler,
                onEdit: editDeckHandler,
              })}
            >
              <Animated.View
                style={{
                  marginBottom: 10,
                  marginHorizontal: 14,
                }}
              >
                <DeckCard
                  title={deck.title}
                  onPress={() => clickDeckHandler(deck.id)}
                />
              </Animated.View>
            </Swipeable>
          ))}
          {renderAddNewDeckCard()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
