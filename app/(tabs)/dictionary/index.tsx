import { DictionaryEntryRead } from "@/components/dictionary-entry-read";
import { useSearchBar } from "@/hooks/use-search-bar";
import {
  getDictionaryEntries,
  removeDictionaryEntryById,
} from "@/utils/dictionary-entry-async-storage";
import { DictionaryEntry } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  SafeAreaView,
  View,
  Pressable,
  LayoutAnimation,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

let currOpenedDeckId: string;
let prevOpenedDeckId: string;

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

export default function DictionaryPage() {
  const swipeable = useRef<any>({});
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>(
    []
  );
  const searchedEntries = useSearchBar(dictionaryEntries, [
    "word",
    "reading",
    "meaning",
  ]);

  const getEntries = useCallback(() => {
    try {
      const data = getDictionaryEntries();
      setDictionaryEntries(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getEntries();
    }, [])
  );

  const closeOpenedCard = () => {
    swipeable.current?.[currOpenedDeckId]?.close();
  };

  const handleEntryRemove = async (id: string) => {
    await removeDictionaryEntryById(id);
    getEntries();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  const handleEditEntry = async (id: string) => {
    router.push(`dictionary/${id}`);
    closeOpenedCard();
  };

  return (
    <SafeAreaView>
      <FlatList
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 10,
        }}
        data={searchedEntries}
        renderItem={({ item }) => (
          <Swipeable
            onSwipeableWillOpen={() => {
              if (prevOpenedDeckId !== item.id) {
                swipeable.current?.[prevOpenedDeckId]?.close();
              }
              prevOpenedDeckId = item.id;
              currOpenedDeckId = item.id;
            }}
            ref={(ref) => (swipeable.current[item.id] = ref)}
            key={item.id}
            renderRightActions={renderRightActions(item.id, {
              onRemove: handleEntryRemove,
              onEdit: handleEditEntry,
            })}
          >
            <DictionaryEntryRead entry={item} />
          </Swipeable>
        )}
      />
    </SafeAreaView>
  );
}
