import { Animated, Pressable, Text } from "react-native";

import React from "react";
import { Swipeable } from "react-native-gesture-handler";
import type { Deck } from "@/utils/types";
import { Card } from "../ui/card";
import { DeckCard } from "../deck-card";
import { useKanjiPageContext } from "../kanji-page-layout/kanji-page-context";
import { router } from "expo-router";

const renderRightActions =
  (id: string, onRemove: (id: string) => void) =>
  (progress: any, dragX: any) => {
    const opacity = dragX.interpolate({
      inputRange: [-70, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <Animated.View
        style={[
          {
            marginLeft: 8,
            opacity,
          },
        ]}
      >
        <Pressable
          onPress={() => onRemove(id)}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "red",
          }}
        >
          <Text style={{ fontSize: 18, color: "whitesmoke" }}>Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

export function SelectedDeckCard({
  deck,
  onRemove,
}: {
  deck: Deck;
  onRemove: (id: string) => void;
}) {
  const { mode } = useKanjiPageContext();

  return (
    <Swipeable renderRightActions={renderRightActions(deck.id, onRemove)}>
      {mode === "read" ? (
        <DeckCard
          title={deck.title}
          onPress={() => router.navigate(`(decks)/${deck.id}`)}
        />
      ) : (
        <Card>
          <Text style={{ color: "whitesmoke", fontSize: 20 }}>
            {deck.title}
          </Text>
        </Card>
      )}
    </Swipeable>
  );
}
